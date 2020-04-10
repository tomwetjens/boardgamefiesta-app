import {Injectable} from '@angular/core';
import {User} from './model';
import {BehaviorSubject, Observable, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';
import {switchMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  loggedIn = new BehaviorSubject<boolean>(false);

  private idToken = new ReplaySubject<any>(1);
  currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) {
    this.oauthService.events.subscribe(() => {
      this.loggedIn.next(this.oauthService.hasValidAccessToken());
      this.idToken.next(this.oauthService.getIdentityClaims());
    });

    this.oauthService.configure(environment.auth);
    this.oauthService.tryLogin();
    this.oauthService.setupAutomaticSilentRefresh();

    this.loggedIn.next(this.oauthService.hasValidAccessToken());
    this.idToken.next(this.oauthService.getIdentityClaims());

    this.currentUser = this.idToken.pipe(switchMap(idToken => {
      if (!idToken) {
        return null;
      }
      return this.httpClient.get<User>(environment.apiBaseUrl + '/users/' + idToken.sub);
    }));
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  findByUsername(username: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/users', {params: {username}});
  }
}
