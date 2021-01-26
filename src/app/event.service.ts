import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../environments/environment';
import {BehaviorSubject, concat, Observable, of, Subject, throwError, timer} from 'rxjs';
import {catchError, distinctUntilChanged, map, retry, startWith, switchMap, tap} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';
import {Event} from './shared/model';
import {BrowserService} from "./browser.service";

const HEARTBEAT_INTERVAL = 60000;

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events = new Subject<Event>();

  webSockets: WebSocket[] = [];
  connected = new BehaviorSubject<boolean>(false);
  connectedCount = 0;

  constructor(private oauthService: OAuthService,
              private browserService: BrowserService) {
    browserService.active
      .pipe(
        switchMap(active => active
          ? timer(0, HEARTBEAT_INTERVAL).pipe(map(() => active))
          : of<boolean>().pipe(startWith(active))))
      .subscribe(active => {
        this.webSockets.forEach(webSocket => {
          this.heartbeat(active, webSocket);
        });
      });

    concat(of({}), this.oauthService.events).pipe(
      map(() => this.oauthService.hasValidIdToken() ? this.oauthService.getIdToken() : null),
      distinctUntilChanged(),
      tap(() => console.log('Creating new WebSocket subject')),
      switchMap(token => webSocket({
        url: environment.wsBaseUrl + '/events' + (!!token ? '?token=' + token : ''),
        openObserver: {
          next: event => {
            const webSocket = event.target as WebSocket;

            this.webSockets.push(webSocket);
            this.browserService.active.subscribe(active => this.heartbeat(active, webSocket));

            this.connectedCount++;
            this.connected.next(this.connectedCount > 0);
          }
        },
        closeObserver: {
          next: event => {
            const webSocket = event.target as WebSocket;

            this.webSockets.splice(this.webSockets.indexOf(webSocket), 1);

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

  private heartbeat(active: boolean, webSocket: WebSocket) {
    const event = {type: active ? 'ACTIVE' : 'INACTIVE'};
    webSocket.send(JSON.stringify(event));
  }

  get connected$(): Observable<boolean> {
    return this.connected.asObservable();
  }

  get events$(): Observable<Event> {
    return this.events.asObservable();
  }
}
