import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../environments/environment';
import {BehaviorSubject, concat, of, ReplaySubject, Subject, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, map, retry, switchMap, tap} from 'rxjs/operators';
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

  events = new Subject<Event>();

  connected = new BehaviorSubject<boolean>(false);

  constructor(private oauthService: OAuthService) {
    concat(of({}, this.oauthService.events)).pipe(
      map((() => this.oauthService.getIdToken())),
      distinctUntilChanged(),
      switchMap(idToken => webSocket({
        url: environment.wsBaseUrl + '/events?token=' + idToken,
        openObserver: {next: () => this.connected.next(true)},
        closeObserver: {next: () => this.connected.next(false)}
      })
        .pipe(retry())),
      catchError(err => {
        this.connected.next(false);
        return throwError(err);
      }))
      .subscribe(message => this.events.next(message as any));
  }
}
