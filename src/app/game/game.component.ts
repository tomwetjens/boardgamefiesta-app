import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {flatMap, take} from 'rxjs/operators';
import {Action, Game, State} from '../model';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game = new ReplaySubject<Game>(1);
  state = new ReplaySubject<State>(1);

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    this.route.params
      .pipe(flatMap(params => this.httpClient.get<Game>(environment.apiBaseUrl + '/games/' + params.id)))
      .subscribe(game => this.game.next(game));

    this.game
      .pipe(flatMap(game => this.httpClient.get<State>(environment.apiBaseUrl + '/games/' + game.id + '/state')))
      .subscribe(state => this.state.next(state));
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

  start() {
    this.game
      .pipe(take(1), flatMap(game => this.httpClient.post<Game>(environment.apiBaseUrl + '/games/' + game.id + '/start', null)))
      .subscribe(game => this.game.next(game));
  }
}
