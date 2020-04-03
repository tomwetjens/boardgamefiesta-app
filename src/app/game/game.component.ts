import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {flatMap} from 'rxjs/operators';
import {Game, State} from '../model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game: Observable<Game>;
  state = new ReplaySubject<State>(1);

  constructor(private route: ActivatedRoute, private httpClient: HttpClient) {
    this.game = this.route.params
      .pipe(flatMap(params => this.httpClient.get<Game>('/api/games/' + params.id)));

    this.game
      .pipe(flatMap(game => this.httpClient.get<State>('/api/games/' + game.id + '/state')))
      .subscribe(state => this.state.next(state));
  }

  ngOnInit(): void {

  }

}
