import {Injectable} from '@angular/core';
import {Table, User} from './shared/model';
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
      return this.authService.userId
        .pipe(switchMap(userId => this.httpClient.get<User>(environment.apiBaseUrl + '/users/' + userId)));
    }));
  }

  get(id: string): Observable<User> {
    return this.httpClient.get<User>(environment.apiBaseUrl + '/users/' + id);
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
}
