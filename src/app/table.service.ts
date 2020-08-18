import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {CreateTableRequest, LogEntry, Table, TableStatus} from './shared/model';
import {BehaviorSubject, combineLatest, Observable, ReplaySubject} from 'rxjs';
import {ChangeOptionsRequest} from './model';
import {concatMap, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap} from "rxjs/operators";
import {EventService} from "./event.service";
import {fromArray} from "rxjs/internal/observable/fromArray";
import {AuthService} from "./auth.service";
import {State} from "./gwt/model";

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private _refresh = new BehaviorSubject(true);
  private _refreshState = new BehaviorSubject(true);
  private _refreshMyActiveTables = new BehaviorSubject(true);
  private _id = new ReplaySubject<string>(1);

  table$: Observable<Table>;
  state$: Observable<any>;
  log$: Observable<LogEntry>;
  myActiveTables$: Observable<Table[]>;

  constructor(private httpClient: HttpClient,
              private authService: AuthService,
              private eventService: EventService) {
    this.table$ = this._id.pipe(
      distinctUntilChanged(),
      switchMap(id => {
        return combineLatest([
          this._refresh,
          this.eventsForTable(id),
          this.reconnected()
        ]).pipe(
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
          this._refreshState,
          this.eventsForTable(table.id),
          this.reconnected()
        ]).pipe(
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
          this.eventsForTable(id),
          this.reconnected()
        ]).pipe(
          map(() => lastRequestedDate),
          startWith(lastRequestedDate), // initial
          switchMap(since => {
            // Request log entries since
            return this.getLog(id, since)
              .pipe(
                // Make sure log entries are sorted ascending
                map(logEntries => logEntries.sort((a, b) =>
                  new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())),
                concatMap(logEntries => fromArray(logEntries)),
                tap(logEntry => lastRequestedDate = new Date(logEntry.timestamp)));
          }),
          shareReplay());
      }));

    this.myActiveTables$ = combineLatest([
      this._refreshMyActiveTables,
      this.eventService.events,
      this.reconnected()
    ]).pipe(
      map(() => true),
      startWith(true),
      switchMap(() => this.find()),
      shareReplay(1)
    );
  }

  private reconnected() {
    return this.eventService.connected.pipe(
      distinctUntilChanged(),
      filter(connected => connected),
      startWith(true));
  }

  private eventsForTable(id: string) {
    return this.eventService.events.pipe(
      filter(event => event.tableId === id),
      startWith({}));
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

  create(request: CreateTableRequest): Observable<Table> {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/create', request);
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

  private getLog(id: string, date: Date): Observable<LogEntry[]> {
    return this.httpClient.get<LogEntry[]>(environment.apiBaseUrl + '/tables/' + id + '/log', {params: {since: date.toISOString()}});
  }

  abandon(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/abandon', null);
  }

  leave(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/leave', null)
      .pipe(tap(() => this.refreshMyActiveTables()));
  }

  invite(id: string, userId: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/invite', {userId});
  }

  kick(id: string, playerId: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/players/' + playerId + '/kick', null);
  }

  addComputer(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/add-computer', null);
  }

  changeOptions(id: string, request: ChangeOptionsRequest) {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/change-options', request);
  }

}
