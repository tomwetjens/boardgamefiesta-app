import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../environments/environment';
import {BehaviorSubject, concat, Observable, of, Subject, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, map, retry, switchMap, tap} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';
import {Event} from './shared/model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events = new Subject<Event>();

  connected = new BehaviorSubject<boolean>(false);
  connectedCount = 0;

  constructor(private oauthService: OAuthService) {
    concat(of({}), this.oauthService.events).pipe(
      map(() => this.oauthService.hasValidIdToken() ? this.oauthService.getIdToken() : null),
      distinctUntilChanged(),
      tap(() => console.log('Creating new WebSocket subject')),
      switchMap(token => webSocket({
        url: environment.wsBaseUrl + '/events' + (!!token ? '?token=' + token : ''),
        openObserver: {
          next: () => {
            this.connectedCount++;
            this.connected.next(this.connectedCount > 0);
          }
        },
        closeObserver: {
          next: () => {
            this.connectedCount = Math.max(0, this.connectedCount - 1);
            this.connected.next(this.connectedCount > 0);
          }
        }
      })
        .pipe(
          tap(msg => console.log('WebSocket message:', msg), err => console.error('WebSocket error:', err)),
          // TODO Better retry
          retry())),
      catchError(err => {
        this.connectedCount = Math.max(0, this.connectedCount - 1);
        this.connected.next(this.connectedCount > 0);
        return throwError(err);
      }))
      .subscribe(message => this.events.next(message as any));
  }

  get connected$(): Observable<boolean> {
    return this.connected.asObservable();
  }

  get events$(): Observable<Event> {
    return this.events.asObservable();
  }
}
