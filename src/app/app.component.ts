import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {ReplaySubject} from 'rxjs';
import {environment} from '../environments/environment';
import {Action, Game} from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'gwt-app';

  game = new ReplaySubject<Game>(1);

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) {
    this.oauthService.configure(environment.auth);
    console.log('AppComponent: tryLogin');
    this.oauthService.tryLogin();

    // this.httpClient.get<Game>('/api/games/a')
    //   .subscribe(response => this.game.next(response));
  }

  initLogin() {
    this.oauthService.initLoginFlow();
  }

  perform(action: Action): void {
    this.httpClient.post<Game>('/api/games/a/perform', action)
      .subscribe(response => this.game.next(response));
  }

  endTurn(): void {
    this.httpClient.post<Game>('/api/games/a/end-turn', null)
      .subscribe(response => this.game.next(response));
  }

  logout() {
    this.oauthService.logOut();
  }
}
