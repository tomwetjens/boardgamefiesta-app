import {Component, Input, OnInit} from '@angular/core';
import {Table, LogEntry} from '../model';
import {TableService} from '../table.service';
import {concat, of} from 'rxjs';
import {EventService} from '../event.service';
import {concatMap, filter, flatMap, map, tap} from 'rxjs/operators';
import {fromArray} from 'rxjs/internal/observable/fromArray';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() table: Table;

  logEntries: LogEntry[] = [];

  constructor(private tableService: TableService, private eventService: EventService) {
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

}
