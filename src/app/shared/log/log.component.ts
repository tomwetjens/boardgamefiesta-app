import {Component, Input, OnInit} from '@angular/core';
import {LogEntry, Table} from '../model';
import {TableService} from '../../table.service';
import {GAME_PROVIDERS} from "../api";
import {map, scan, shareReplay} from "rxjs/operators";
import {Observable} from "rxjs";
import {fadeInOnEnterAnimation} from "angular-animations";

interface Group {
  timestamp: Date;
  logEntries: LogEntry[];
}

const PERIOD = 60000;

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

  logEntries$: Observable<LogEntry[]>;
  groups$: Observable<Group[]>;

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.logEntries$ = this.tableService.log$.pipe(
      scan((array, logEntry) => {
        array.unshift(logEntry);
        return array;
      }, []),
      shareReplay(1)
    );

    this.groups$ = this.logEntries$.pipe(
      map(logEntries => {
        const groups = [];

        let group: Group;
        for (const logEntry of logEntries) {
          if (!group || group.timestamp.getTime() - new Date(logEntry.timestamp).getTime() > PERIOD) {
            group = {timestamp: new Date(logEntry.timestamp), logEntries: []};
            groups.push(group);
          }
          group.logEntries.push(logEntry);
        }

        return groups;
      })
    );
  }

  trackLogEntry(index: number, logEntry: LogEntry): any {
    return logEntry.timestamp;
  }

  trackGroup(index: number, group: Group): any {
    return group.logEntries[group.logEntries.length - 1].timestamp;
  }

  translateInGameEvent(logEntry: LogEntry) {
    return GAME_PROVIDERS[this.table.game].translate(logEntry, this.table);
  }
}
