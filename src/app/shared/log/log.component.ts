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

import {Component, Input, OnInit} from '@angular/core';
import {LogEntry, LogEntryType, Table, TablePlayer, User} from '../model';
import {TableService} from '../../table.service';
import {GAME_PROVIDERS} from "../api";
import {fadeInOnEnterAnimation} from "angular-animations";
import {TranslateService} from "@ngx-translate/core";

interface Group {
  key: string;
  logEntries: LogEntry[];
}

function groupKey(logEntry: LogEntry) {
  // timestamp = "YYYY-MM-DDTHH:mm:ss.SSSZ"
  // Group by minute
  return logEntry.timestamp.substr(0, 16);
}

@Component({
  selector: 'app-log',
  animations: [
    fadeInOnEnterAnimation()
  ],
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() table: Table;

  groups: Group[] = [];

  constructor(private tableService: TableService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.tableService.log$.subscribe(logEntry => {
      // Assumption is that only new log entries are emitted, oldest first
      let group = this.groups.length > 0 ? this.groups[0] : undefined;

      // Does it fit in the current group?
      const key = groupKey(logEntry);
      if (!group || group.key !== key) {
        // We must create a new group
        const newGroup = {key, logEntries: []};
        this.groups.unshift(newGroup);
        group = newGroup;
      }

      group.logEntries.unshift(logEntry);
    });
  }

  trackLogEntry(index: number, logEntry: LogEntry): any {
    return logEntry.timestamp;
  }

  trackGroup(index: number, group: Group): any {
    return group.key;
  }

  translateInGameEvent(logEntry: LogEntry) {
    return GAME_PROVIDERS[this.table.game].translate(logEntry, this.table);
  }

  translate(logEntry: LogEntry) {
    return this.translateService.instant('log.' + logEntry.type, {
      ...this.toInterpolateParams(logEntry.parameters, this.table),
      otherUser: logEntry.otherUser?.username
    });
  }

  private toInterpolateParams(values: any[], table: Table) {
    return values.reduce((ctx, value, index) => {
      return {
        ...ctx,
        ['value' + (index + 1)]: this.translateValue(value, table)
      };
    }, {});
  }

  private translateValue(value: string, table: Table): string {
    const player = table.players[value];

    if (player) {
      return this.translatePlayer(player);
    }

    return value;
  }

  private translatePlayer(player: TablePlayer): string {
    return player.user
      ? this.translateUser(player.user)
      : this.translateService.instant('computer');
  }

  private translateUser(user: User) {
    return user.username;
  }

  showMore() {
    const oldestGroup = this.groups[this.groups.length - 1];
    const oldestLogEntry = oldestGroup.logEntries[oldestGroup.logEntries.length - 1];
    this.tableService.getLogBefore(this.table.id, new Date(oldestLogEntry.timestamp), 30)
      .subscribe(logEntries => {
        // Assumption: log entries are emitted by descending timestamp

        let group = oldestGroup;

        logEntries.forEach(logEntry => {
          const key = groupKey(logEntry);
          if (key !== group.key) {
            // Add a new group
            group = {key, logEntries: [logEntry]};
            this.groups.push(group);
          } else {
            group.logEntries.push(logEntry);
          }
        });
      });
  }

  get hasMoreLogEntries(): boolean {
    if (this.groups.length === 0) {
      return false;
    }

    const oldestGroup = this.groups[this.groups.length - 1];
    const oldestLogEntry = oldestGroup.logEntries[oldestGroup.logEntries.length - 1];
    return oldestLogEntry.type !== LogEntryType.CREATE;
  }

}
