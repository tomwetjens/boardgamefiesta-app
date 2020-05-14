import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Action, CreateTableRequest, Table, LogEntry, PossibleBuy, PossibleDelivery, PossibleMove, State} from './model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private httpClient: HttpClient) {
  }

  create(request: CreateTableRequest): Observable<Table> {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/create', request);
  }

  get(id: string): Observable<Table> {
    return this.httpClient.get<Table>(environment.apiBaseUrl + '/tables/' + id);
  }

  start(id: string): Observable<Table> {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/start', null);
  }

  find(): Observable<Table[]> {
    return this.httpClient.get<Table[]>(environment.apiBaseUrl + '/tables');
  }

  accept(id: string): Observable<any> {
    return this.httpClient.post(environment.apiBaseUrl + '/tables/' + id + '/accept', null);
  }

  reject(id: string): Observable<any> {
    return this.httpClient.post(environment.apiBaseUrl + '/tables/' + id + '/reject', null);
  }

  perform(id: string, action: Action): Observable<State> {
    return this.httpClient.post<State>(environment.apiBaseUrl + '/tables/' + id + '/perform', action);
  }

  skip(id: string): Observable<State> {
    return this.httpClient.post<State>(environment.apiBaseUrl + '/tables/' + id + '/skip', null);
  }

  endTurn(id: string): Observable<State> {
    return this.httpClient.post<State>(environment.apiBaseUrl + '/tables/' + id + '/end-turn', null);
  }

  getState(id: string): Observable<State> {
    return this.httpClient.get<State>(environment.apiBaseUrl + '/tables/' + id + '/state');
  }

  getPossibleMoves(id: string, to: string): Observable<PossibleMove[]> {
    return this.httpClient.get<PossibleMove[]>(environment.apiBaseUrl + '/tables/' + id + '/state/possible-moves', {params: {to}});
  }

  getPossibleDeliveries(id: string): Observable<PossibleDelivery[]> {
    return this.httpClient.get<PossibleDelivery[]>(environment.apiBaseUrl + '/tables/' + id + '/state/possible-deliveries');
  }

  getPossibleBuys(id: string): Observable<PossibleBuy[]> {
    return this.httpClient.get<PossibleBuy[]>(environment.apiBaseUrl + '/tables/' + id + '/state/possible-buys');
  }

  getLog(id: string, date: Date): Observable<LogEntry[]> {
    return this.httpClient.get<LogEntry[]>(environment.apiBaseUrl + '/tables/' + id + '/log', {params: {since: date.toISOString()}});
  }

  abandon(id: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/abandon', null);
  }

  leave(id: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/leave', null);
  }
}
