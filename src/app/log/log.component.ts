import {Component, Input, OnInit} from '@angular/core';
import {Game, LogEntry} from '../model';
import {GameService} from '../game.service';
import {concat, Observable, of} from 'rxjs';
import {EventService} from '../event.service';
import {filter, flatMap, map, mergeAll, tap, toArray, windowCount} from 'rxjs/operators';
import {fromArray} from 'rxjs/internal/observable/fromArray';
import {log} from 'util';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() game: Game;

  logEntries: LogEntry[] = [];

  constructor(private gameService: GameService, private eventService: EventService) {
  }

  ngOnInit(): void {
    let lastRequestedDate = new Date(0);

    concat(of(lastRequestedDate),
      this.eventService.events
        .pipe(filter(event => event.gameId === this.game.id),
          map(() => lastRequestedDate)))
      .pipe(
        tap(since => console.log({since})),
        flatMap(since => this.gameService.getLog(this.game.id, since)),
        tap(() => lastRequestedDate = new Date()),
        flatMap(response => fromArray(response)),
        tap(logEntry => console.log({logEntry})))
      .subscribe(logEntry => {
        this.logEntries.push(logEntry);
      });
  }

}
