import {Injectable} from '@angular/core';
import {User} from './shared/model';
import {Observable, of, ReplaySubject} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {OAuthService} from 'angular-oauth2-oidc';
import {switchMap, take} from 'rxjs/operators';
import {fromPromise} from 'rxjs/internal-compatibility';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClient: HttpClient, private oauthService: OAuthService) {
    this.currentUser = this.idToken.pipe(switchMap(idToken => {
      if (!idToken || !this.oauthService.hasValidIdToken()) {
        return of(null);
      }
      return this.httpClient.get<User>(environment.apiBaseUrl + '/users/' + idToken.sub);
    }));

    this.oauthService.events.subscribe(() => {
      this.loggedIn.next(this.oauthService.hasValidAccessToken());
      this.idToken.next(this.oauthService.getIdentityClaims());
    });

    this.oauthService.configure(environment.auth);
    this.oauthService.setupAutomaticSilentRefresh();

    fromPromise(this.oauthService.tryLogin())
      .subscribe(result => {
        this.loggedIn.next(this.oauthService.hasValidAccessToken());
        this.idToken.next(this.oauthService.getIdentityClaims());
      });
  }

  private idToken = new ReplaySubject<any>(1);
  loggedIn = new ReplaySubject<boolean>(1);

  currentUser: Observable<User>;

  login() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

  find(q: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/users', {params: {q}});
  }

  isLoggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable().pipe(take(1));
  }

  changeLocation(id: string, location: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-location', {location});
  }

  changeLanguage(id: string, language: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-language', {language});
  }
}
