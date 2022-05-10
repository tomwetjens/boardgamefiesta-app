/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Observable, of, Subject} from 'rxjs';
import {bufferCount, filter, finalize, map, switchMap, takeUntil, withLatestFrom} from 'rxjs/operators';
import {
  EventType,
  LogEntry,
  LogEntryType,
  Options,
  PlayerStatus,
  Table,
  TableMode,
  TablePlayer,
  TableType
} from '../shared/model';
import {EventService} from '../event.service';
import {TableService} from '../table.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {MessageDialogComponent} from '../shared/message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {TranslateService} from '@ngx-translate/core';
import {AudioService, DICE} from '../audio.service';
import {ToastrService} from "../toastr.service";
import {GAME_PROVIDERS, GameProvider, Option} from "../shared/api";
import {InvitePlayerComponent} from "../invite-player/invite-player.component";
import {TitleService} from "../title.service";
import {DeviceSettingsService} from "../shared/device-settings.service";

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
  private dialog: NgbModalRef;

  table: Observable<Table>;
  provider$: Observable<GameProvider>;
  isOwner$: Observable<boolean>;
  emptySeats$: Observable<number>;

  types = Object.keys(TableType);
  modes = Object.keys(TableMode);
  hideDescription = true;

  minNumberOfPlayers: number;
  maxNumberOfPlayers: number;
  autoStart: boolean;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private tableService: TableService,
              private eventService: EventService,
              private ngbModal: NgbModal,
              private titleService: TitleService,
              private translateService: TranslateService,
              private audioService: AudioService,
              private toastrService: ToastrService,
              private deviceSettingsService: DeviceSettingsService) {

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

    this.isOwner$ = this.table.pipe(map(table => table && table.player && table.players[table.player].user.id === table.owner.id));
    this.emptySeats$ = this.table.pipe(map(table => table ? Math.max(0, table.maxNumberOfPlayers - table.numberOfPlayers) : 0));

    this.table
      .pipe(
        takeUntil(this.destroyed),
        filter(table => !!table))
      .subscribe(table => {
        this.minNumberOfPlayers = table.minNumberOfPlayers;
        this.maxNumberOfPlayers = table.maxNumberOfPlayers;
        this.autoStart = table.autoStart;
      });

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
        if (current && previous && current.id === previous.id) {
          if (current.turn && !previous.turn) {
            this.audioService.alert();
          }

          if (current.otherPlayers.some(a => current.players[a].status === PlayerStatus.ACCEPTED
            && !previous.otherPlayers.some(b => b === a && previous.players[b].status === PlayerStatus.ACCEPTED))) {
            this.audioService.playAlert(DICE);
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
        filter(([logEntry, table]) => table && (!logEntry.player || logEntry.player.id !== table.player)),
        // Prevent popping up very old log entries in case of reconnect
        filter(([logEntry]) => new Date().getTime() - new Date(logEntry.timestamp).getTime() < 6000)
      ).subscribe(([logEntry, table]) => {
      switch (logEntry.type) {
        case LogEntryType.IN_GAME_EVENT:
          this.notifyInGameEvent(table, logEntry);
          break;
        case LogEntryType.BEGIN_TURN:
        case LogEntryType.END_TURN:
        case LogEntryType.UNDO:
        case LogEntryType.KICK:
        case LogEntryType.LEFT:
          this.notifyEvent(table, logEntry);
          break;
      }
    });
  }

  private notifyInGameEvent(table: Table, logEntry: LogEntry) {
    this.toastrService.inGameEvent(GAME_PROVIDERS[table.game].translate(logEntry, table), {},
      !!logEntry.player ? table.players[logEntry.player.id] : null, logEntry.user);
  }

  private notifyEvent(table: Table, logEntry: LogEntry) {
    this.toastrService.inGameEvent(this.translateService.instant('log.' + logEntry.type), {},
      !!logEntry.player ? table.players[logEntry.player.id] : null, logEntry.user);
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);

    if (this.dialog) {
      this.dialog.close();
    }
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
    (table.autoStart && table.minNumberOfPlayers <= table.otherPlayers
      .map(pid => table.players[pid])
      .filter(p => p.status === PlayerStatus.ACCEPTED).length + 1
      ? this.confirmJoinAutoStart()
      : of(null))
      .pipe(switchMap(() => this.tableService.accept(table.id)))
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  confirmJoinAutoStart(): Observable<void> {
    this.dialog = this.ngbModal.open(MessageDialogComponent);
    const messageDialogComponent = this.dialog.componentInstance as MessageDialogComponent;
    messageDialogComponent.type = 'confirm';
    messageDialogComponent.messageKey = 'table.confirmJoinAutoStart';
    messageDialogComponent.confirmKey = 'table.confirmJoinAndStart';
    messageDialogComponent.cancelKey = 'cancel';
    return fromPromise(this.dialog.result)
      .pipe(finalize(() => this.dialog = null));
  }

  reject(table: Table) {
    this.tableService.reject(table.id)
      .subscribe(() => this.router.navigate(['/']), () => this.router.navigate(['/']));
  }

  changeOptions(table: Table, options: Options) {
    this.tableService.changeOptions(table.id, {options})
      .subscribe(() => {
        this.deviceSettingsService.deviceSettings
          .pipe(map(deviceSettings => deviceSettings || {}))
          .subscribe(deviceSettings => {
            if (!deviceSettings[table.game]) {
              deviceSettings[table.game] = {};
            }

            deviceSettings[table.game]['defaultOptions'] = options;

            this.deviceSettingsService.save();
          });
      });
  }

  join(table: Table) {
    (table.autoStart && table.minNumberOfPlayers <= table.numberOfPlayers + 1
      ? this.confirmJoinAutoStart()
      : of(null))
      .pipe(switchMap(() => this.tableService.join(table.id)))
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
      .subscribe(() => {
        this.tableService.refresh();

        this.deviceSettingsService.deviceSettings
          .pipe(map(deviceSettings => deviceSettings || {}))
          .subscribe(deviceSettings => {
            if (!deviceSettings['table']) {
              deviceSettings['table'] = {};
            }

            deviceSettings['table']['defaultType'] = type;

            this.deviceSettingsService.save();
          });
      }, () => this.tableService.refresh());
  }

  changeMode(table: Table, mode: TableMode) {
    this.tableService.changeMode(table.id, mode)
      .subscribe(() => {
        this.tableService.refresh();

        this.deviceSettingsService.deviceSettings
          .pipe(map(deviceSettings => deviceSettings || {}))
          .subscribe(deviceSettings => {
            if (!deviceSettings['table']) {
              deviceSettings['table'] = {};
            }

            deviceSettings['table']['defaultMode'] = mode;

            this.deviceSettingsService.save();
          });
      }, () => this.tableService.refresh());
  }

  changeMinMaxPlayers(table: Table) {
    this.tableService.changeMinMaxNumberOfPlayers(table.id, this.minNumberOfPlayers, this.maxNumberOfPlayers)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

  changeAutoStart(table: Table) {
    this.tableService.changeAutoStart(table.id, this.autoStart)
      .subscribe(() => this.tableService.refresh(), () => this.tableService.refresh());
  }

}
