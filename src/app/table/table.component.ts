import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {of, ReplaySubject, Subject} from 'rxjs';
import {skipWhile, switchMap, take, takeUntil} from 'rxjs/operators';
import {EventType, Options, PlayerStatus, Table, TablePlayer, TableStatus} from '../shared/model';
import {EventService} from '../event.service';
import {TableService} from '../table.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageDialogComponent} from '../shared/message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {SelectUserComponent} from '../select-user/select-user.component';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();
  private left = new Subject();
  private leaving = false;

  table = new ReplaySubject<Table>(1);
  state = new ReplaySubject<any>(1);

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tableService: TableService,
              private eventService: EventService,
              private ngbModal: NgbModal,
              private title: Title,
              private translateService: TranslateService) {

  }

  ngOnInit(): void {
    this.refreshTable();

    this.table
      .pipe(takeUntil(this.destroyed))
      .subscribe(table => {
        this.title.setTitle(this.translateService.instant('game.' + table.game));

        if (table.status === TableStatus.STARTED || table.status === TableStatus.ENDED) {
          this.refreshState();
        }
      });

    this.eventService.events
      .pipe(
        takeUntil(this.destroyed),
        takeUntil(this.left),
        skipWhile(() => this.leaving))
      // TODO Filter on current table
      .subscribe(event => {
        switch (event.type) {
          case EventType.ACCEPTED:
          case EventType.REJECTED:
          case EventType.STARTED:
          case EventType.ENDED:
          case EventType.INVITED:
          case EventType.UNINVITED:
          case EventType.PROPOSED_TO_LEAVE:
          case EventType.AGREED_TO_LEAVE:
          case EventType.LEFT:
          case EventType.ABANDONED:
          case EventType.KICKED:
          case EventType.OPTIONS_CHANGED:
            this.refreshTable();
            break;

          case EventType.STATE_CHANGED:
            this.refreshTable();
            this.refreshState();
            break;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  private refreshTable() {
    this.route.params
      .pipe(switchMap(params => this.tableService.get(params.id)))
      .subscribe(table => this.table.next(table));
  }

  start(table: Table) {
    let confirm = of(true);

    if (this.hasInvitedPlayers(table)) {
      const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
      ngbModalRef.componentInstance.message = 'Some players have not yet responded. They will not be able to join the table. Do you still want to start the table?';
      ngbModalRef.componentInstance.confirm = 'START';
      ngbModalRef.componentInstance.cancel = 'WAIT_FOR_PLAYERS';

      confirm = fromPromise(ngbModalRef.result);
    }

    confirm
      .pipe(
        switchMap(() => this.tableService.start(table.id)))
      .subscribe();
  }

  private hasInvitedPlayers(table: Table) {
    return table.players[table.player].status === PlayerStatus.INVITED
      || table.otherPlayers.some(name => table.players[name].status === PlayerStatus.INVITED);
  }

  perform(table: Table, action: any) {
    this.tableService.perform(table.id, action)
      .subscribe(() => {
        this.refreshState();
      });
  }

  skip(table: Table) {
    this.tableService.skip(table.id)
      .subscribe(() => {
        this.refreshState();
      });
  }

  endTurn(table: Table) {
    this.tableService.endTurn(table.id)
      .subscribe(() => this.refreshState());
  }

  private refreshState() {
    this.table.pipe(
      takeUntil(this.destroyed),
      takeUntil(this.left),
      skipWhile(() => this.leaving),
      take(1),
      switchMap(table => this.tableService.getState(table.id)))
      .subscribe(state => this.state.next(state));
  }

  abandon(table: Table) {
    this.leaving = true;
    this.tableService.abandon(table.id)
      .subscribe(
        () => {
          this.left.next(true);
          this.router.navigate(['/']);
        },
        () => {
          this.leaving = false;
          this.refreshTable();
        });
  }

  leave(table: Table) {
    this.leaving = true;

    this.tableService.leave(table.id)
      .subscribe(
        () => {
          this.left.next(true);
          this.router.navigate(['/']);
        }, () => {
          this.leaving = false;
          this.refreshTable();
        });
  }

  invite(table: Table) {
    const ngbModalRef = this.ngbModal.open(SelectUserComponent);
    fromPromise(ngbModalRef.result)
      .pipe(switchMap(user => this.tableService.invite(table.id, user.id)))
      .subscribe(() => this.refreshTable());
  }

  addComputer(table: Table) {
    this.tableService.addComputer(table.id)
      .subscribe(() => this.refreshTable());
  }

  kick(table: Table, player: TablePlayer) {
    this.tableService.kick(table.id, player.id)
      .subscribe(() => this.refreshTable());
  }

  accept(table: Table) {
    this.tableService.accept(table.id)
      .subscribe(() => this.refreshTable());
  }

  reject(table: Table) {
    this.tableService.reject(table.id)
      .subscribe(() => this.router.navigate(['/']));
  }

  changeOptions(table: Table, options: Options) {
    this.tableService.changeOptions(table.id, {options})
      .subscribe();
  }
}
