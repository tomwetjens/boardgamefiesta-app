/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {Injectable} from '@angular/core';
import {environment} from '../environments/environment';
import {fromPromise} from 'rxjs/internal-compatibility';
import {OAuthService} from 'angular-oauth2-oidc';
import {Observable, of, ReplaySubject} from 'rxjs';
import {distinctUntilChanged, map, shareReplay, startWith, switchMap, tap} from 'rxjs/operators';
import {ToastrService} from './toastr.service';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private claims = new ReplaySubject<any>(1);

  loggedIn = new ReplaySubject<boolean>(1);
  token: Observable<string>; // Should not emit until auth flow is completed

  constructor(private oauthService: OAuthService,
              private toastrService: ToastrService,
              private router: Router) {
    this.token = this.loggedIn
      .pipe(
        switchMap(() => this.oauthService.events.pipe(startWith({}))),
        map(() => this.oauthService.hasValidIdToken() ? this.oauthService.getIdToken() : null),
        distinctUntilChanged(),
        tap(() => console.debug('Token expires at', new Date(this.oauthService.getIdTokenExpiration()))),
        shareReplay(1));

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
      .pipe(
        switchMap(() => {
          if (!this.oauthService.hasValidIdToken()) {
            // No valid ID token, checking if refresh token is present
            if (!!this.oauthService.getRefreshToken()) {
              // Refreshing token with refresh token
              return fromPromise(this.oauthService.refreshToken());
            }
          }
          return of(null);
        })
      )
      .subscribe(() => {
        const loggedIn = this.oauthService.hasValidIdToken();
        this.loggedIn.next(loggedIn);

        const claims = this.oauthService.getIdentityClaims();
        this.claims.next(claims);

        if (loggedIn && this.oauthService.state) {
          // Returning to URL after login
          this.router.navigateByUrl(this.oauthService.state);
        }
      });
  }

  initLoginFlow() {
    const returnUrl = window.location.pathname;
    this.oauthService.initLoginFlow(returnUrl);
  }

  logout() {
    this.oauthService.logOut();
  }

}
