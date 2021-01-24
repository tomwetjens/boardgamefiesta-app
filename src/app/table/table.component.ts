import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {bufferCount, filter, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {EventType, LogEntryType, Options, PlayerStatus, Table, TablePlayer, TableType} from '../shared/model';
import {EventService} from '../event.service';
import {TableService} from '../table.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {MessageDialogComponent} from '../shared/message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {TranslateService} from '@ngx-translate/core';
import {AudioService} from '../audio.service';
import {ToastrService} from "../toastr.service";
import {GAME_PROVIDERS, GameProvider, Option} from "../shared/api";
import {InvitePlayerComponent} from "../invite-player/invite-player.component";
import {TitleService} from "../title.service";

interface Seat {
  player?: TablePlayer;
}

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  table: Observable<Table>;
  provider$: Observable<GameProvider>;

  types = Object.keys(TableType);
  hideDescription = true;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tableService: TableService,
              private eventService: EventService,
              private ngbModal: NgbModal,
              private titleService: TitleService,
              private translateService: TranslateService,
              private audioService: AudioService,
              private toastrService: ToastrService) {

  }

  ngOnInit(): void {
    this.table = this.route.params.pipe(
      takeUntil(this.destroyed),
      switchMap(({tableId}) => {
        // Make sure Table id is set before switching to Observable
        this.tableService.load(tableId);
        return this.tableService.table$;
      })
    );

    this.table
      .pipe(
        takeUntil(this.destroyed),
        filter(table => !!table))
      .subscribe(table => {
        const name = this.translateService.instant('game.' + table.game + '.name');
        this.titleService.setTitle(name);
      }, () => this.router.navigate(['/']));

    this.provider$ = this.table.pipe(
      map(table => GAME_PROVIDERS[table.game]));

    this.table
      .pipe(bufferCount(2, 1))
      .subscribe(([previous, current]) => {
        if (current && previous) {
          if (current.turn && !previous.turn) {
            this.audioService.alert();
          }
        }
      });

    this.tableService.events$
      .pipe(
        takeUntil(this.destroyed),
        withLatestFrom(this.table),
        filter(([event, table]) => event.tableId === table.id))
      .subscribe(([event, table]) => {
        switch (event.type) {
          case EventType.LEFT:
          case EventType.ABANDONED:
          case EventType.KICKED:
            if (table && (!table.player || event.userId === table.players[table.player].user.id)) {
              // We are no longer in this table
              this.router.navigateByUrl('/');
            }
            break;
        }
      });

    this.tableService.log$
      .pipe(
        takeUntil(this.destroyed),
        withLatestFrom(this.table),
        // Do not show the stuff we already know
        filter(([logEntry, table]) => !logEntry.player || logEntry.player.id !== table.player),
        // Prevent popping up very old log entries in case of reconnect
        filter(([logEntry]) => new Date().getTime() - new Date(logEntry.timestamp).getTime() < 6000)
      ).subscribe(([logEntry, table]) => {
      switch (logEntry.type) {
        case LogEntryType.IN_GAME_EVENT:
          this.notifyInGameEvent(table, logEntry);
          break;
      }
    });
  }

  private notifyInGameEvent(table, logEntry) {
    this.toastrService.inGameEvent(GAME_PROVIDERS[table.game].translate(logEntry, table), {}, logEntry.player, logEntry.user);
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
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

  abandon(table: Table) {
    this.tableService.abandon(table.id)
      .subscribe(() => this.router.navigate(['/']), () => this.tableService.refresh());
  }

  leave(table: Table) {
    this.tableService.leave(table.id)
      .subscribe(() => this.router.navigate(['/']), () => this.tableService.refresh());
  }

  invite(table: Table) {
    const ngbModalRef = this.ngbModal.open(InvitePlayerComponent);

    const componentInstance = ngbModalRef.componentInstance as InvitePlayerComponent;
    componentInstance.tableId = table.id;

    fromPromise(ngbModalRef.result)
      .pipe(switchMap(user => this.tableService.invite(table.id, user.id)))
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  addComputer(table: Table) {
    this.tableService.addComputer(table.id)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  kick(table: Table, player: TablePlayer) {
    this.tableService.kick(table.id, player.id)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  accept(table: Table) {
    this.tableService.accept(table.id)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  reject(table: Table) {
    this.tableService.reject(table.id)
      .subscribe(() => this.router.navigate(['/']), () => this.router.navigate(['/']));
  }

  changeOptions(table: Table, options: Options) {
    this.tableService.changeOptions(table.id, {options})
      .subscribe();
  }

  join(table: Table) {
    this.tableService.join(table.id)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  makePublic(table: Table) {
    this.tableService.makePublic(table.id)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  makePrivate(table: Table) {
    this.tableService.makePrivate(table.id)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  trackOption(index: number, option: Option): any {
    return option.key;
  }

  changeType(table: Table, type: TableType) {
    this.tableService.changeType(table.id, type)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }
}
