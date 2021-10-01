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
import {
  CreateTableRequest,
  Event,
  EventType,
  LogEntry,
  Table,
  TableMode,
  TableStatus,
  TableType,
  User
} from './shared/model';
import {BehaviorSubject, combineLatest, from, Observable, ReplaySubject, Subject, throwError} from 'rxjs';
import {ChangeOptionsRequest} from './model';
import {
  catchError,
  concatMap, debounceTime,
  distinctUntilChanged,
  filter,
  map,
  retry,
  share,
  shareReplay, skip, skipWhile,
  startWith,
  switchMap,
  tap
} from "rxjs/operators";
import {AuthService} from "./auth.service";
import {State} from "./gwt/model";
import {webSocket} from "rxjs/webSocket";
import {EventService} from "./event.service";
import {DeviceSettingsService} from "./shared/device-settings.service";

const MIN_TIME_BETWEEN_REFRESHES = 800;

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

  events$: Observable<Event>;
  connected$ = new BehaviorSubject<boolean>(false);
  table$: Observable<Table>;
  state$: Observable<any>;
  /**
   * only new log entries as they come in, oldest first
   */
  log$: Observable<LogEntry>;
  myActiveTables$: Observable<Table[]>;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private eventService: EventService,
              private deviceSettingsService: DeviceSettingsService) {
    this.events$ = combineLatest([
      this.authService.token.pipe(distinctUntilChanged()),
      this._id.pipe(distinctUntilChanged())
    ]).pipe(
      switchMap(([token, id]) => webSocket({
        url: environment.wsBaseUrl + '/tables/' + id + '/events?token=' + token,
        openObserver: {
          next: () => {
            console.log('Connected to table');
            this._connectedCount++;
            this.connected$.next(this._connectedCount > 0);
          }
        },
        closeObserver: {
          next: () => {
            console.log('Disconnected from table');
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

    this.table$ = this._id.pipe(
      distinctUntilChanged(),
      switchMap(id => {
        return combineLatest([
          this._refresh.pipe(startWith(true)), // Always start with a value because of combineLatest
          this.events$.pipe(startWith({})), // Always start with a value because of combineLatest
          this._reconnected$.pipe(startWith(true)) // Always start with a value because of combineLatest
        ]).pipe(
          debounceTime(MIN_TIME_BETWEEN_REFRESHES), // When refresh, event or reconnected happens at the same time, just do it once
          switchMap(() => this.get(id)),
          // For each new id, immediately start with an empty value to prevent replaying
          // the previous table, while it is fetching the new table
          startWith(null as Table));
      }),
      shareReplay(1));

    this.state$ = this.table$.pipe(
      distinctUntilChanged((a, b) => a.status === b.status),
      filter(table => [TableStatus.STARTED, TableStatus.ENDED].includes(table.status)),
      switchMap(table => {
        return combineLatest([
          this._refreshState.pipe(
            startWith(true) // Always start with a value because of combineLatest
          ),
          this.events$.pipe(
            // Only trigger on interesting events
            filter(event => [EventType.STATE_CHANGED].includes(event.type)),
            startWith({}) // Always start with a value because of combineLatest
          ),
          this._reconnected$.pipe(
            startWith(true)) // Always start with a value because of combineLatest
        ]).pipe(
          debounceTime(MIN_TIME_BETWEEN_REFRESHES), // When refresh, event or reconnected happens at the same time, just do it once
          switchMap(() => this.getState(table.id)),
          // For each new table, immediately start with an empty value to prevent replaying
          // the state of the previous table, while it is fetching the state of the new table
          startWith(null as State));
      }),
      shareReplay(1));

    this.log$ = this._id.pipe(
      distinctUntilChanged(),
      switchMap(id => {
        let lastRequestedDate = new Date(0);
        return combineLatest([
          this.events$.pipe(startWith({})),
          this._reconnected$.pipe(startWith(true))
        ]).pipe(
          map(() => lastRequestedDate),
          switchMap(since => {
            // Request log entries since
            return this.getLogSince(id, since, 30)
              .pipe(
                // Make sure log entries are sorted ascending
                map(logEntries => logEntries.sort((a, b) =>
                  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())),
                concatMap(logEntries => from(logEntries)),
                tap(logEntry => lastRequestedDate = new Date(logEntry.timestamp)));
          }),
          shareReplay());
      }));

    this.myActiveTables$ = combineLatest([
      this._refreshMyActiveTables.pipe(startWith(true)),// Always start with a value because of combineLatest
      this.eventService.events.pipe(startWith({})),// Always start with a value because of combineLatest
      this._reconnected$.pipe(startWith(true))// Always start with a value because of combineLatest
    ]).pipe(
      debounceTime(MIN_TIME_BETWEEN_REFRESHES), // When refresh, event or reconnected happens at the same time, just do it once
      map(() => true),
      startWith(true),
      switchMap(() => this.find()),
      shareReplay(1)
    );
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

}
