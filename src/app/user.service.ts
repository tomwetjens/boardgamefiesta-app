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
import {ColorPreferences, EmailPreferences, Table, User} from './shared/model';
import {BehaviorSubject, combineLatest, Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {map, switchMap, tap} from 'rxjs/operators';
import {AuthService} from "./auth.service";

export interface Rating {
  userId: string;
  gameId: string;
  tableId: string;
  timestamp: string;
  rating: number;
  deltas?: RatingDelta[];
}

export interface RatingDelta {
  user: User;
  delta: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _refresh = new BehaviorSubject(true);

  currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.currentUser = combineLatest([
      this._refresh,
      this.authService.loggedIn
    ]).pipe(switchMap(([_, loggedIn]) => {
      if (!loggedIn) {
        return of(null);
      }
      return this.httpClient.get<User>(environment.apiBaseUrl + '/user');
    }));
  }

  get(idOrUsername: string): Observable<User> {
    return this.httpClient.get<User>(environment.apiBaseUrl + '/users/' + idOrUsername);
  }

  find(q: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/users', {params: {q}});
  }

  changeLocation(id: string, location: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-location', {location})
      .pipe(tap(_ => this._refresh.next(true)));
  }

  changeLanguage(id: string, language: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-language', {language})
      .pipe(tap(_ => this._refresh.next(true)));
  }

  changeTimeZone(id: string, timeZone: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-time-zone', {timeZone})
      .pipe(tap(_ => this._refresh.next(true)));
  }

  changeEmail(id: string, email: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-email', {email})
      .pipe(tap(_ => this._refresh.next(true)));
  }

  changePassword(id: string, password: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-password', {password});
  }

  getRatings(gameId: string, userId: string): Observable<Rating[]> {
    return this.httpClient.get<Rating[]>(environment.apiBaseUrl + '/users/' + userId + '/ratings', {params: {gameId}});
  }

  getRating(userId: string, tableId: string): Observable<Rating> {
    return this.httpClient.get<Rating[]>(environment.apiBaseUrl + '/users/' + userId + '/ratings', {params: {tableId}})
      .pipe(map(response => response[0]));
  }

  getTables(userId: string): Observable<Table[]> {
    return this.httpClient.get<Table[]>(environment.apiBaseUrl + '/users/' + userId + '/tables');
  }

  changeUsername(username: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/user/change-username', {username})
      .pipe(tap(_ => this._refresh.next(true)));
  }

  changeEmailPreferences(change: EmailPreferences) {
    return this.httpClient.post(environment.apiBaseUrl + '/user/change-email-preferences', change)
      .pipe(tap(_ => this._refresh.next(true)));
  }

  changeColorPreferences(change: ColorPreferences) {
    return this.httpClient.post(environment.apiBaseUrl + '/user/change-color-preferences', change)
      .pipe(tap(_ => this._refresh.next(true)));
  }
}
