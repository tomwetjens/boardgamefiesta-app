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

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) {
    this.oauthService.configure(environment.auth);
    this.oauthService.tryLogin();
    this.oauthService.setupAutomaticSilentRefresh();
  }

}
