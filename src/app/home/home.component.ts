import { Component, OnInit } from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Game} from '../model';
import {HttpClient} from '@angular/common/http';
import {OAuthService} from 'angular-oauth2-oidc';
import {environment} from '../../environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  games = new ReplaySubject<Game[]>(1);

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) { }

  ngOnInit(): void {
    if (this.loggedIn) {
      this.refresh();
    }
  }

  create() {
    this.httpClient.post<Game>(environment.apiBaseUrl + '/games/create', {
      inviteUserIds: ['34efb2e1-8ef6-47e3-a1d1-3f986d2d7c1d'] // sharon
    })
      .subscribe(() => this.refresh());
  }

  get loggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }

  private refresh() {
    this.httpClient.get<Game[]>(environment.apiBaseUrl + '/games')
      .subscribe(games => this.games.next(games));
  }

  accept(game: Game) {
    this.httpClient.post(environment.apiBaseUrl + '/games/' + game.id + '/accept', null)
      .subscribe(() => this.refresh());
  }

  reject(game: Game) {
    this.httpClient.post(environment.apiBaseUrl + '/games/' + game.id + '/reject', null)
      .subscribe(() => this.refresh());
  }
}
