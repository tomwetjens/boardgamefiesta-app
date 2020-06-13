import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {fromPromise} from 'rxjs/internal-compatibility';
import {OAuthService} from 'angular-oauth2-oidc';
import {Observable, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';
import {ToastrService} from './toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private claims = new ReplaySubject<any>(1);

  loggedIn = new ReplaySubject<boolean>(1);
  token: Observable<string>; // Should not emit until auth flow is completed
  userId: Observable<string>;

  constructor(private oauthService: OAuthService,
              private toastrService: ToastrService) {
    this.token = this.loggedIn
      .pipe(
        map(() => this.oauthService.hasValidIdToken() ? this.oauthService.getIdToken() : null),
        distinctUntilChanged());

    this.userId = this.claims.pipe(map(claims => claims.sub));

    this.oauthService.events
      .subscribe(event => {
        const loggedIn = this.oauthService.hasValidIdToken();
        this.loggedIn.next(loggedIn);

        const claims = this.oauthService.getIdentityClaims();
        this.claims.next(claims);

        switch (event.type) {
          case 'token_validation_error':
            this.toastrService.error('errors.TOKEN_VALIDATION_ERROR');
            break;
        }
      });

    this.oauthService.configure(environment.auth);
    this.oauthService.setupAutomaticSilentRefresh();

    fromPromise(this.oauthService.tryLogin())
      .subscribe(result => {
        const loggedIn = this.oauthService.hasValidIdToken();
        this.loggedIn.next(loggedIn);

        const claims = this.oauthService.getIdentityClaims();
        this.claims.next(claims);
      });
  }

  initLoginFlow() {
    this.oauthService.initLoginFlow();
  }

  logout() {
    this.oauthService.logOut();
  }

}
