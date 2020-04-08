import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {flatMap, map, switchMap, take} from 'rxjs/operators';
import {Action, Game, State} from '../model';
import {environment} from '../../environments/environment';
import {EventService} from '../event.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game = new ReplaySubject<Game>(1);
  state = new ReplaySubject<State>(1);

  turn = this.state.pipe(map(state => state.currentPlayer === state.player.player.name));

  constructor(private route: ActivatedRoute, private httpClient: HttpClient, private eventService: EventService) {
    this.route.params
      .pipe(flatMap(params => this.httpClient.get<Game>(environment.apiBaseUrl + '/games/' + params.id)))
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

  ngOnInit(): void {

  }

  perform(action: Action) {
    this.game
      .pipe(take(1), flatMap(game => this.httpClient.post<State>(environment.apiBaseUrl + '/games/' + game.id + '/perform', action)))
      .subscribe(state => this.state.next(state));
  }

  endTurn() {
    this.game
      .pipe(take(1), flatMap(game => this.httpClient.post<State>(environment.apiBaseUrl + '/games/' + game.id + '/end-turn', null)))
      .subscribe(state => this.state.next(state));
  }

  private refreshState() {
    this.game.pipe(
      take(1),
      switchMap(game => this.httpClient.get<State>(environment.apiBaseUrl + '/games/' + game.id + '/state')))
      .subscribe(state => this.state.next(state));
  }
}
