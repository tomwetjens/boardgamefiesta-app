import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {AddFriendRequest} from "./model";
import {BehaviorSubject, Observable} from "rxjs";
import {User} from "./shared/model";
import {map, shareReplay, switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  private _refresh = new BehaviorSubject<boolean>(false);

  myFriends$: Observable<User[]>;

  constructor(private httpClient: HttpClient) {
    this.myFriends$ = this._refresh.pipe(
      switchMap(() => this.get()),
      shareReplay(1));
  }

  private get(): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/friends');
  }

  friends$(userId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/users/' + userId + '/friends');
  }

  add(userId: string): Observable<void> {
    return this.httpClient.post<AddFriendRequest>(environment.apiBaseUrl + '/friends', {userId})
      .pipe(
        map(() => null),
        tap({complete: () => this._refresh.next(true)}));
  }

  remove(userId: string): Observable<void> {
    return this.httpClient.delete(environment.apiBaseUrl + '/friends/' + userId)
      .pipe(
        map(() => null),
        tap({complete: () => this._refresh.next(true)}));
  }

}
