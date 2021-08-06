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

import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {Injectable, Injector} from '@angular/core';
import {environment} from '../environments/environment';
import {catchError, defaultIfEmpty, filter, map, switchMap, take} from 'rxjs/operators';
import {ToastrService} from './toastr.service';
import {ErrorCode, ErrorResponse} from './model';
import {Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private router: Router,
              private injector: Injector,
              private toastrService: ToastrService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return this.addToken(request)
      .pipe(
        switchMap(req => next.handle(req)),
        catchError(response => this.handleError(response)));
  }

  private addToken(request: HttpRequest<any>) {
    if (!request.url.startsWith(environment.apiBaseUrl)) {
      return of(request);
    }

    const authService = this.injector.get(AuthService);

    return authService.token.pipe(
      take(1),
      filter(token => !!token),
      map(token => request.clone({headers: request.headers.set('Authorization', 'Bearer ' + token)})),
      defaultIfEmpty(request));
  }

  private handleError(response: HttpErrorResponse): Observable<any> {
    if (!response.url.startsWith(environment.apiBaseUrl)) {
      // Not an API error
      return throwError(response);
    }

    if (response.status === 401) {
      // Unauthorized, must login
      const authService = this.injector.get(AuthService);
      authService.initLoginFlow();
    } else if (response.status >= 400 && response.status < 500 && response.error && response.error.errorCode) {
      const error = response.error as ErrorResponse;
      if (error.errorCode === ErrorCode.IN_GAME_ERROR) {
        this.toastrService.error(error.gameId + '.errors.' + error.reasonCode);
      } else {
        this.toastrService.error('errors.' + error.errorCode);
      }
    } else if (response.status === 404) {
      this.toastrService.error('errors.RESOURCE_NOT_FOUND');
    } else if (response.status === 403) {
      this.toastrService.error('errors.FORBIDDEN');
    } else if (response.status === 502 || response.status === 503) {
      // TODO Handle 503 from backend
      // TODO Handle 502 from backend
      this.toastrService.error('errors.SERVER_NOT_AVAILABLE');
    } else if (response.status >= 400) {
      this.toastrService.error('errors.UNEXPECTED_SERVER_ERROR');
    } else {
      console.error('Error connecting to server: ' + response.message);
      this.toastrService.error('errors.CONNECTION_FAILED');
    }
    return throwError(response);
  }
}
