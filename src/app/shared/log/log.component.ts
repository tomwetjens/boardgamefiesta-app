import {Component, Input, OnInit} from '@angular/core';
import {LogEntry, LogEntryType, Table, TablePlayer, User} from '../model';
import {TableService} from '../../table.service';
import {concat, of} from 'rxjs';
import {EventService} from '../../event.service';
import {concatMap, filter, map, tap} from 'rxjs/operators';
import {TranslateService} from '@ngx-translate/core';
import {GWTEventType} from '../../gwt/model';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() table: Table;

  logEntries: LogEntry[] = [];

  constructor(private tableService: TableService,
              private eventService: EventService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    let lastRequestedDate = new Date(0);

    concat(of(lastRequestedDate),
      this.eventService.events
        .pipe(filter(event => event.tableId === this.table.id),
          map(() => lastRequestedDate)))
      .pipe(
        concatMap(since => this.tableService.getLog(this.table.id, since)),
        tap(() => lastRequestedDate = new Date()))
      .subscribe(newLogEntries => {
        Array.prototype.unshift.apply(this.logEntries, newLogEntries);
      });
  }

  translate(logEntry: LogEntry) {
    switch (logEntry.type) {
      case LogEntryType.IN_GAME_EVENT:
        // TODO Extract this to GWT specific logic
        switch (logEntry.parameters[0]) {
          case 'ACTION':
            return this.translateService.instant('gwt.log.action.' + logEntry.parameters[1],
              {
                value1: this.translateValue(logEntry.parameters[2]),
                value2: this.translateValue(logEntry.parameters[3]),
                value3: this.translateValue(logEntry.parameters[4])
              });
          default:
            return this.translateService.instant('gwt.log.' + logEntry.parameters[0],
              {
                value1: this.translateValue(logEntry.parameters[1]),
                value2: logEntry.parameters[0] === GWTEventType.PAY_FEE_PLAYER
                  ? this.translatePlayer(this.table.players[logEntry.parameters[2]])
                  : this.translateValue(logEntry.parameters[2]),
                value3: this.translateValue(logEntry.parameters[3])
              });
        }
      default:
        return this.translateService.instant('log.' + logEntry.type, {
          value1: [LogEntryType.INVITE, LogEntryType.KICK].includes(logEntry.type)
            ? this.translateUser(logEntry.otherUser)
            : logEntry.parameters[0],
          value2: logEntry.parameters[1],
          value3: logEntry.parameters[2],
        });
    }
  }

  private translateValue(value: string): string {
    const gameSpecificKey = this.table.game + '.log.values.' + value;
    const genericKey = 'log.values.' + value;

    let translated = this.translateService.instant(gameSpecificKey);
    if (translated === gameSpecificKey) {
      translated = this.translateService.instant(genericKey);
    }

    return translated !== genericKey ? translated : value;
  }

  private translatePlayer(player: TablePlayer): string {
    return player.user
      ? this.translateUser(player.user)
      : this.translateService.instant('computer');
  }

  private translateUser(user: User) {
    return user.username;
  }
}
