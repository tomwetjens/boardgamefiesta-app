import {Injectable} from '@angular/core';
import {webSocket, WebSocketSubject} from 'rxjs/webSocket';
import {environment} from '../environments/environment';
import {concat, of, Subject, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, flatMap, map, tap} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';

export interface Event {
  readonly type: string;
  readonly gameId: string;
  readonly userId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private webSocket: WebSocketSubject<string>;

  events = new Subject<Event>();

  constructor(private oauthService: OAuthService) {
    console.log('EventService constructor');

    concat(of(oauthService.getIdToken(), this.oauthService.events)).pipe(
      map((() => this.oauthService.getIdToken())),
      distinctUntilChanged(),
      flatMap(idToken => {
        console.log('creating websocket');
        this.webSocket = webSocket({
          url: environment.wsBaseUrl + '/events?token=' + idToken
        });
        return this.webSocket;
      }),
      tap(message => console.log('websocket message:', message)),
      catchError(err => {
        console.error('websocket error', err);
        return throwError(err);
      }))
      .subscribe(message => this.events.next(message as any));
  }
}
