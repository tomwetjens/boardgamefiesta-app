import {Component} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {Action, Game} from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gwt-app';

  game = new ReplaySubject<Game>(1);

  constructor(private httpClient: HttpClient) {
    this.httpClient.get<Game>('/api/games/a')
      .subscribe(response => this.game.next(response));
  }

  perform(action: Action): void {
    this.httpClient.post<Game>('/api/games/a/perform', action)
      .subscribe(response => this.game.next(response));
  }

  endTurn(): void {
    this.httpClient.post<Game>('/api/games/a/end-turn', null)
      .subscribe(response => this.game.next(response));
  }
}
