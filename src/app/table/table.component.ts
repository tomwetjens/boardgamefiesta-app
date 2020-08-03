import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {BehaviorSubject, of, Subject} from 'rxjs';
import {bufferCount, filter, map, skipWhile, switchMap, take, takeUntil, tap, withLatestFrom} from 'rxjs/operators';
import {EventType, LogEntryType, Options, PlayerStatus, Table, TablePlayer, TableStatus} from '../shared/model';
import {EventService} from '../event.service';
import {TableService} from '../table.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageDialogComponent} from '../shared/message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {SelectUserComponent} from '../select-user/select-user.component';
import {Title} from '@angular/platform-browser';
import {TranslateService} from '@ngx-translate/core';
import {AudioService} from '../audio.service';
import {ToastrService} from "../toastr.service";
import {GWTEventType} from "../gwt/model";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();
  private left = new Subject();
  private leaving = false;

  table = new BehaviorSubject<Table>(undefined);
  state = new BehaviorSubject<any>(undefined);

  hideDescription = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tableService: TableService,
              private eventService: EventService,
              private ngbModal: NgbModal,
              private title: Title,
              private translateService: TranslateService,
              private audioService: AudioService,
              private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.route.params.subscribe(params => this.refreshTable(params.id));

    this.table
      .pipe(
        takeUntil(this.destroyed),
        filter(table => !!table))
      .subscribe(table => {
        const name = this.translateService.instant('game.' + table.game + '.name');
        this.title.setTitle(name);

        if (table.status === TableStatus.STARTED || table.status === TableStatus.ENDED) {
          this.refreshState(table);
        }
      });

    this.table
      .pipe(bufferCount(2, 1))
      .subscribe(([previous, current]) => {
        if (current && previous) {
          if (current.turn && !previous.turn) {
            this.audioService.alert();
          }
        }
      });

    this.eventService.events
      .pipe(
        takeUntil(this.destroyed),
        takeUntil(this.left),
        tap(event => console.log('TableComponent event:', event)),
        skipWhile(() => this.leaving),
        withLatestFrom(this.table),
        filter(([event, table]) => event.tableId === table.id))
      .subscribe(([event, table]) => {
        switch (event.type) {
          case EventType.ACCEPTED:
          case EventType.REJECTED:
          case EventType.STARTED:
          case EventType.ENDED:
          case EventType.INVITED:
          case EventType.UNINVITED:
          case EventType.OPTIONS_CHANGED:
          case EventType.PROPOSED_TO_LEAVE:
          case EventType.AGREED_TO_LEAVE:
            this.refreshTable(table.id);
            break;

          case EventType.LEFT:
          case EventType.ABANDONED:
          case EventType.KICKED:
            if (this.table.value && (!this.table.value.player || event.userId === this.table.value.players[this.table.value.player].user.id)) {
              // We are no longer in this table
              this.router.navigateByUrl('/');
            } else {
              // We are still in this table
              this.refreshTable(table.id);
            }
            break;

          // TODO Translations
          // TODO Cart image for player board
          // TODO BOnus cards caranvasary
          // TODO Log

          case EventType.STATE_CHANGED:
            this.refreshTable(table.id);
            break;
        }
      });

    this.table
      .pipe(
        filter(table => !!table),
        take(1),
        switchMap(table => this.tableService.log(table.id)
          .pipe(
            // Do not show the stuff we already know
            filter(logEntry => logEntry.player.id !== table.player),
            // Prevent popping up very old log entries in case of reconnect
            filter(logEntry => new Date().getTime() - new Date(logEntry.timestamp).getTime() < 6000),
            map(logEntry => ({logEntry, table})))))
      .subscribe(({logEntry, table}) => {
        switch (logEntry.type) {
          case LogEntryType.IN_GAME_EVENT:
            switch (logEntry.parameters[0] as GWTEventType) {
              case GWTEventType.ACTION:
                this.toastrService.inGameEvent('gwt.log.action.' + logEntry.parameters[1],
                  {
                    value1: this.translateValue(table, logEntry.parameters[2]),
                    value2: this.translateValue(table, logEntry.parameters[3]),
                    value3: this.translateValue(table, logEntry.parameters[4]),
                    value4: this.translateValue(table, logEntry.parameters[5]),
                    value5: this.translateValue(table, logEntry.parameters[6])
                  },
                  logEntry.player, logEntry.user);
                break;
            }
            break;
        }
      });
  }

  // TODO Move this somewhere shared with log component
  private translateValue(table: Table, value: string): string {
    const gameSpecificKey = table.game + '.log.values.' + value;
    const genericKey = 'log.values.' + value;

    let translated = this.translateService.instant(gameSpecificKey);
    if (translated === gameSpecificKey) {
      translated = this.translateService.instant(genericKey);
    }

    return translated !== genericKey ? translated : value;
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  private refreshTable(id: string) {
    this.tableService.get(id)
      .subscribe(table => this.table.next(table), () => this.router.navigate(['/']));
  }

  start(table: Table) {
    let confirm = of(true);

    if (this.hasInvitedPlayers(table)) {
      const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
      const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
      messageDialogComponent.type = 'alert';
      messageDialogComponent.titleKey = 'confirmDialog';
      messageDialogComponent.messageKey = 'confirmStart';
      messageDialogComponent.confirmKey = 'start';
      messageDialogComponent.cancelKey = 'waitForPlayers';

      confirm = fromPromise(ngbModalRef.result);
    }

    confirm
      .pipe(
        switchMap(() => this.tableService.start(table.id)))
      .subscribe();
  }

  private hasInvitedPlayers(table: Table) {
    return (table.player && table.players[table.player].status === PlayerStatus.INVITED)
      || table.otherPlayers.some(name => table.players[name].status === PlayerStatus.INVITED);
  }

  perform(table: Table, action: any) {
    this.tableService.perform(table.id, action)
      .subscribe(() => {
        this.refreshState(table);
      });
  }

  skip(table: Table) {
    this.tableService.skip(table.id)
      .subscribe(() => {
        this.refreshState(table);
      });
  }

  endTurn(table: Table) {
    this.tableService.endTurn(table.id)
      .subscribe(() => this.refreshState(table));
  }

  private refreshState(table: Table) {
    console.log('TableComponent refreshing state');
    this.tableService.getState(table.id)
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
          this.refreshTable(table.id);
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
          this.refreshTable(table.id);
        });
  }

  invite(table: Table) {
    const ngbModalRef = this.ngbModal.open(SelectUserComponent);
    fromPromise(ngbModalRef.result)
      .pipe(switchMap(user => this.tableService.invite(table.id, user.id)))
      .subscribe(() => this.refreshTable(table.id));
  }

  addComputer(table: Table) {
    this.tableService.addComputer(table.id)
      .subscribe(() => this.refreshTable(table.id));
  }

  kick(table: Table, player: TablePlayer) {
    this.tableService.kick(table.id, player.id)
      .subscribe(() => this.refreshTable(table.id));
  }

  accept(table: Table) {
    this.tableService.accept(table.id)
      .subscribe(() => this.refreshTable(table.id));
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
