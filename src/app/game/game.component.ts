import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {combineLatest, Observable, ReplaySubject} from 'rxjs';
import {filter, flatMap, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {Action, Game, PossibleMove, State} from '../model';
import {EventService} from '../event.service';
import {GameService} from '../game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game = new ReplaySubject<Game>(1);
  state = new ReplaySubject<State>(1);

  possibleMoves: Observable<PossibleMove[]>;

  constructor(private route: ActivatedRoute, private gameService: GameService, private eventService: EventService) {

  }

  ngOnInit(): void {
    this.route.params
      .pipe(flatMap(params => this.gameService.get(params.id)))
      .subscribe(game => this.game.next(game));

    this.game.subscribe(() => this.refreshState());

    this.eventService.events
      .subscribe(event => {
        console.log('GameComponent: event=', event);

        if (event.type === 'STATE_CHANGED') {
          this.refreshState();
        }
      });
  }

  perform(action: Action) {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.perform(game.id, action)))
      .subscribe(state => this.state.next(state));
  }

  endTurn() {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.endTurn(game.id)))
      .subscribe(state => this.state.next(state));
  }

  private refreshState() {
    this.game.pipe(
      take(1),
      switchMap(game => this.gameService.getState(game.id)))
      .subscribe(state => this.state.next(state));
  }

}
