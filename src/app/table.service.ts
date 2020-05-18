import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Action, CreateTableRequest, LogEntry, State, Table} from './model';
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

  getLog(id: string, date: Date): Observable<LogEntry[]> {
    return this.httpClient.get<LogEntry[]>(environment.apiBaseUrl + '/tables/' + id + '/log', {params: {since: date.toISOString()}});
  }

  abandon(id: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/abandon', null);
  }

  leave(id: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/leave', null);
  }

  invite(id: string, userId: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/invite', {userId});
  }

  kick(id: string, playerId: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/players/' + playerId + '/kick', null);
  }

  addComputer(id: string) {
    return this.httpClient.post<Table>(environment.apiBaseUrl + '/tables/' + id + '/add-computer', null);
  }

}
