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
      switchMap(token => webSocket({
        url: environment.wsBaseUrl + (!!token ? '?token=' + token : ''),
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
          tap({error: err => console.error('WebSocket error:', err)}),
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
