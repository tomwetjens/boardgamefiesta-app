import {Component, Input, OnInit} from '@angular/core';
import {Game, LogEntry} from '../model';
import {GameService} from '../game.service';
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
        concatMap(since => this.gameService.getLog(this.game.id, since)),
        tap(() => lastRequestedDate = new Date()))
      .subscribe(newLogEntries => {
        Array.prototype.unshift.apply(this.logEntries, newLogEntries);
      });
  }

}
