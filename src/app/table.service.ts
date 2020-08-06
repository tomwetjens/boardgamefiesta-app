import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {CreateTableRequest, EventType, LogEntry, Table, TableStatus} from './shared/model';
import {BehaviorSubject, combineLatest, concat, Observable, of, ReplaySubject} from 'rxjs';
import {ChangeOptionsRequest} from './model';
import {concatMap, distinctUntilChanged, filter, map, shareReplay, startWith, switchMap, tap} from "rxjs/operators";
import {EventService} from "./event.service";
import {fromArray} from "rxjs/internal/observable/fromArray";

@Injectable({
  providedIn: 'root'
})
export class TableService {

  private _logs: Map<string, Observable<LogEntry>> = new Map();

  private _refresh = new BehaviorSubject(true);
  private _refreshState = new BehaviorSubject(true);
  private _id = new ReplaySubject<string>(1);
  table$: Observable<Table>;
  state$: Observable<any>;

  constructor(private httpClient: HttpClient,
              private eventService: EventService) {
    this.table$ = this._id.pipe(
      distinctUntilChanged(),
      switchMap(id => {
        return combineLatest([
          this._refresh,
          this.eventsForTable(id).pipe(
            startWith({}))
        ]).pipe(
          switchMap(() => this.get(id)));
      }),
      shareReplay(1));

    this.state$ = this.table$.pipe(
      distinctUntilChanged((a, b) => a.status !== b.status),
      filter(table => [TableStatus.STARTED, TableStatus.ENDED].includes(table.status)),
      switchMap(table => {
        return combineLatest([
          this._refreshState,
          this.eventsForTable(table.id).pipe(
            startWith({}))
        ]).pipe(
          switchMap(() => this.getState(table.id)));
      }),
      shareReplay(1));
  }

  private eventsForTable(id: string) {
    return this.eventService.events.pipe(
      filter(event => event.tableId === id));
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

  create(request: CreateTableRequest): Observable<Table> {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/create', request);
  }

  get(id: string): Observable<Table> {
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

  getState<T>(id: string): Observable<T> {
    return this.httpClient.get<T>(environment.apiBaseUrl + '/tables/' + id + '/state');
  }

  // TODO Make private in favor of log()
  getLog(id: string, date: Date): Observable<LogEntry[]> {
    return this.httpClient.get<LogEntry[]>(environment.apiBaseUrl + '/tables/' + id + '/log', {params: {since: date.toISOString()}});
  }

  log(id: string): Observable<LogEntry> {
    const existing = this._logs.get(id);
    if (existing) {
      return existing;
    } else {
      let lastRequestedDate = new Date();
      const created = concat(of(lastRequestedDate), // initial
        this.eventService.events
          .pipe(
            filter(event => event.type === EventType.STATE_CHANGED),
            filter(event => event.tableId === id),
            map(() => lastRequestedDate))) // after state change
        .pipe(
          switchMap(since => {
            return this.getLog(id, since)
              // Make sure log entries are sorted ascending, even if server returns them descending (for now)
              .pipe(map(response => response.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())));
          }),
          tap(logEntries => lastRequestedDate = new Date()),
          concatMap(logEntries => fromArray(logEntries)));

      this._logs.set(id, created);

      return created;
    }
  }

  abandon(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/abandon', null);
  }

  leave(id: string): Observable<void> {
    return this.httpClient.post<void>(environment.apiBaseUrl + '/tables/' + id + '/leave', null);
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
