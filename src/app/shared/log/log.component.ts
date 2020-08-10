import {Component, Input, OnInit} from '@angular/core';
import {LogEntry, Table} from '../model';
import {TableService} from '../../table.service';
import {GAME_PROVIDERS} from "../api";

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() table: Table;

  logEntries: LogEntry[] = [];

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.tableService.log$.subscribe(logEntry => this.logEntries.unshift(logEntry));
  }

  trackLogEntry(index: number, logEntry: LogEntry): any {
    return logEntry.timestamp;
  }

  translateInGameEvent(logEntry: LogEntry) {
    return GAME_PROVIDERS[this.table.game].translate(logEntry, this.table);
  }
}
