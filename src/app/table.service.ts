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
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {CreateTableRequest, Event, LogEntry, Table, TableMode, TableType, User} from './shared/model';
import {
  BehaviorSubject,
  combineLatest,
  from,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
  throwError,
  timer
} from 'rxjs';
import {ChangeOptionsRequest} from './model';
import {
  catchError,
  concatMap,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  retry,
  share,
  shareReplay,
  skip,
  startWith,
  switchMap,
  tap,
  throttleTime
} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {webSocket} from "rxjs/webSocket";
import {EventService} from "./event.service";
import {DeviceSettingsService} from "./shared/device-settings.service";
import {BrowserService} from "./browser.service";

const MIN_TIME_BETWEEN_REFRESH = 800;
const HEARTBEAT_INTERVAL = 60000;

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private _refresh = new Subject();
  private _refreshState = new Subject();
  private _refreshMyActiveTables = new Subject();
  private _id = new ReplaySubject<string>(1);
  private _connectedCount = 0;
  private _reconnected$: Observable<boolean>;
  private _webSockets: WebSocket[] = [];

  events$: Observable<Event>;
  connected$ = new BehaviorSubject<boolean>(false);
  table$: Observable<Table>;
  state$: Observable<object>;

  /**
   * The first subscriber triggers the initial fetch of the 30 most recent log entries (for the current table).
   * After the initial fetch, it emits only new log entries as they come in.
   *
   * New subscribers will be emitted all log entries that have been fetched up until now (for the current table).
   *
   * The order of the emitted log entries is chronologically (i.e. most recent is emitted last).
   */
  log$: Observable<LogEntry>;

  myActiveTables$: Observable<Table[]>;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private browserService: BrowserService,
              private eventService: EventService,
              private deviceSettingsService: DeviceSettingsService) {
    browserService.active
      .pipe(
        switchMap(active => active
          ? timer(0, HEARTBEAT_INTERVAL).pipe(map(() => active))
          : of<boolean>().pipe(startWith(active))))
      .subscribe(active => {
        this._webSockets.forEach(webSocket => {
          this.heartbeat(active, webSocket);
        });
      });

    this.events$ = combineLatest([
      this.authService.token.pipe(distinctUntilChanged()),
      this._id.pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([token, id]) => webSocket({
        url: environment.wsBaseUrl + '?table=' + id + '&token=' + token,
        openObserver: {
          next: event => {
            console.log('Connected to table');

            const webSocket = event.target as WebSocket;

            this._webSockets.push(webSocket);
            this.browserService.active.subscribe(active => this.heartbeat(active, webSocket));

            this._connectedCount++;
            this.connected$.next(this._connectedCount > 0);
          }
        },
        closeObserver: {
          next: event => {
            console.log('Disconnected from table');

            const webSocket = event.target as WebSocket;
            this._webSockets.splice(this._webSockets.indexOf(webSocket), 1);

            this._connectedCount = Math.max(0, this._connectedCount - 1);
            this.connected$.next(this._connectedCount > 0);
          }
        }
      }).pipe(retry())),
      catchError(err => {
        console.error('Error connecting to table', err);
        this._connectedCount = Math.max(0, this._connectedCount - 1);
        this.connected$.next(this._connectedCount > 0);
        return throwError(err);
      }),
      map(msg => msg as Event),
      share());

    this._reconnected$ = this.connected$.pipe(
      distinctUntilChanged(),
      filter(connected => connected === true),
      skip(1), // Skip initial connected
      debounceTime(1000) // Only emit if reconnected after some time
    );

    this.table$ = combineLatest([
      this._id.pipe(distinctUntilChanged()),
      // Other triggers that retrieve the table again
      merge(
        this._refresh,
        this.events$,
        this._reconnected$
      ).pipe(
        throttleTime(MIN_TIME_BETWEEN_REFRESH), // When refresh, event or reconnected happens at the same time, just do it once
        startWith([])  // Always start with a value because of combineLatest
      )
    ]).pipe(
      switchMap(([id]) => this.get(id)),
      shareReplay(1)
    );

    this.state$ = this.table$.pipe(
      filter(table => !!table?.state),
      map(table => table.state)
    );

    this.log$ = this._id.pipe(
      distinctUntilChanged(),
      map(id => this.logStreamForTable$(id)),
      shareReplay(1), // When resubscribed to the same (unchanged) table, then reuse the existing stream
      switchMap(stream => stream)
    );

    this.myActiveTables$ = combineLatest([
      this._refreshMyActiveTables.pipe(startWith(true)), // Always start with a value because of combineLatest
      this.eventService.events$.pipe(startWith({})), // Always start with a value because of combineLatest
      this._reconnected$.pipe(startWith(true)) // Always start with a value because of combineLatest
    ]).pipe(
      throttleTime(MIN_TIME_BETWEEN_REFRESH), // When refresh, event or reconnected happens at the same time, just do it once
      map(() => true),
      startWith(true),
      switchMap(() => this.find()),
      shareReplay(1)
    );
  }

  private heartbeat(active: boolean, webSocket: WebSocket) {
    const event = {type: active ? 'ACTIVE' : 'INACTIVE'};
    webSocket.send(JSON.stringify(event));
  }

  load(id: string) {
    this._id.next(id);
  }

  refresh() {
    this._refresh.next(true);
  }

  refreshState() {
    this._refreshState.next(true);
  }

  refreshMyActiveTables() {
    this._refreshMyActiveTables.next(true);
  }

  create(gameId: string): Observable<Table> {
    return this.deviceSettingsService.deviceSettings
      .pipe(
        map(deviceSettings => deviceSettings || {}),
        map(deviceSettings => {
          const tableSettings = deviceSettings['table'] || {};
          const gameSettings = deviceSettings[gameId] || {};

          const request: CreateTableRequest = {
            game: gameId,
            type: tableSettings['defaultType'] || TableType.REALTIME,
            mode: tableSettings['defaultMode'] || TableMode.NORMAL,
            options: gameSettings['defaultOptions'] || undefined
          };
          return request;
        }),
        switchMap(request => this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/create', request))
      );
  }

  private get(id: string): Observable<Table> {
    return this.httpClient.get<Table>(environment.apiBaseUrl + '/tables/' + id);
  }

  start(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/start', null);
  }

  find(): Observable<Table[]> {
    return this.httpClient.get<Table[]>(environment.apiBaseUrl + '/tables');
  }

  accept(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/accept', null);
  }

  reject(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/reject', null);
  }

  makePrivate(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/private', null);
  }

  makePublic(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/public', null);
  }

  perform(id: string, action: any): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/perform', action);
  }

  skip(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/skip', null);
  }

  endTurn(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/end-turn', null);
  }

  undo(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/undo', null);
  }

  private getState<T>(id: string): Observable<T> {
    return this.httpClient.get<T>(environment.apiBaseUrl + '/tables/' + id + '/state');
  }

  private getLogSince(id: string, since: Date, limit: number): Observable<LogEntry[]> {
    return this.httpClient.get<LogEntry[]>(environment.apiBaseUrl + '/tables/' + id + '/log', {
      params: {
        since: since.toISOString(),
        limit: limit + ''
      }
    });
  }

  abandon(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/abandon', null);
  }

  leave(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/leave', null)
      .pipe(tap(() => this.refreshMyActiveTables()));
  }

  join(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/join', null)
      .pipe(tap(() => this.refreshMyActiveTables()));
  }

  invite(id: string, userId: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/invite', {userId});
  }

  kick(id: string, playerId: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/players/' + playerId + '/kick', null);
  }

  forceEndTurn(id: string, playerId: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/players/' + playerId + '/force-end-turn', null);
  }

  addComputer(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/add-computer', null);
  }

  changeOptions(id: string, request: ChangeOptionsRequest) {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/change-options', request);
  }

  changeMinMaxNumberOfPlayers(id: string, minNumberOfPlayers: number, maxNumberOfPlayers: number) {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/change-min-max-players', {
      minNumberOfPlayers,
      maxNumberOfPlayers
    });
  }

  changeAutoStart(id: string, autoStart: boolean) {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/change-auto-start', {autoStart});
  }

  getSuggestedPlayers(id: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/tables/' + id + '/suggested-players');
  }

  changeType(id: string, type: TableType) {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/change-type', {type});
  }

  changeMode(id: string, mode: TableMode) {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/change-mode', {mode});
  }

  getLogBefore(tableId: string, date: Date, limit: number): Observable<LogEntry[]> {
    return this.httpClient.get<LogEntry[]>(environment.apiBaseUrl + '/tables/' + tableId + '/log', {
      params: {
        before: date.toISOString(),
        limit: '' + limit
      }
    });
  }

  findStarted(gameId: string, lastEvaluatedTimestamp?: string, lastEvaluatedId?: string): Observable<Table[]> {
    return this.httpClient.get<Table[]>(environment.apiBaseUrl + '/games/' + gameId + '/started', {
      params: {
        lts: lastEvaluatedTimestamp || '',
        lid: lastEvaluatedId || ''
      }
    });
  }

  findOpen(gameId: string, lastEvaluatedTimestamp?: string, lastEvaluatedId?: string): Observable<Table[]> {
    return this.httpClient.get<Table[]>(environment.apiBaseUrl + '/games/' + gameId + '/open', {
      params: {
        lts: lastEvaluatedTimestamp || '',
        lid: lastEvaluatedId || ''
      }
    });
  }

  /**
   * The first subscriber triggers the initial fetch of the 30 most recent log entries.
   * After the initial fetch, it emits only new log entries as they come in.
   *
   * New subscribers will be emitted all log entries that have been fetched up until now.
   *
   * The order of the emitted log entries is chronologically (i.e. most recent is emitted last).
   */
  private logStreamForTable$(id: string): Observable<LogEntry> {
    let since: Date = new Date(0);

    return merge(
      this.events$.pipe(filter(event => event.tableId === id)),
      this._reconnected$
    ).pipe(
      startWith([]), // Initial
      concatMap(() => {
        // Fetch (new) log entries since last received log entry
        const initial = since.getTime() === 0;
        return this.getLogSince(id, since, initial ? 30 : 999)
          .pipe(
            // Make sure log entries are sorted chronologically
            map(logEntries => logEntries.sort(compareLogEntryByTimestamp)),
            // Turn array into a stream of log entries
            concatMap(logEntries => from(logEntries)),
            // Record timestamp of last emitted log entry for next fetch
            tap(logEntry => since = new Date(logEntry.timestamp)));
      }),
      // Replay entire stream (up until now) to new subscribers
      shareReplay()
    );
  }
}

function compareLogEntryByTimestamp(a: LogEntry, b: LogEntry): number {
  return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
}
