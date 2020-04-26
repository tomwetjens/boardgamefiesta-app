import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Action, CreateGameRequest, Game, PossibleBuy, PossibleDelivery, PossibleMove, State} from './model';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) {
  }

  create(request: CreateGameRequest): Observable<Game> {
    return this.httpClient.post<Game>(environment.apiBaseUrl + '/games/create', request);
  }

  get(id: string): Observable<Game> {
    return this.httpClient.get<Game>(environment.apiBaseUrl + '/games/' + id);
  }

  start(id: string): Observable<Game> {
    return this.httpClient.post<Game>(environment.apiBaseUrl + '/games/' + id + '/start', null);
  }

  find(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(environment.apiBaseUrl + '/games');
  }

  accept(id: string): Observable<any> {
    return this.httpClient.post(environment.apiBaseUrl + '/games/' + id + '/accept', null);
  }

  reject(id: string): Observable<any> {
    return this.httpClient.post(environment.apiBaseUrl + '/games/' + id + '/reject', null);
  }

  perform(id: string, action: Action): Observable<State> {
    return this.httpClient.post<State>(environment.apiBaseUrl + '/games/' + id + '/perform', action);
  }

  skip(id: string): Observable<State> {
    return this.httpClient.post<State>(environment.apiBaseUrl + '/games/' + id + '/skip', null);
  }

  endTurn(id: string): Observable<State> {
    return this.httpClient.post<State>(environment.apiBaseUrl + '/games/' + id + '/end-turn', null);
  }

  getState(id: string): Observable<State> {
    return this.httpClient.get<State>(environment.apiBaseUrl + '/games/' + id + '/state');
  }

  getPossibleMoves(id: string, to: string): Observable<PossibleMove[]> {
    return this.httpClient.get<PossibleMove[]>(environment.apiBaseUrl + '/games/' + id + '/state/possible-moves', {params: {to}});
  }

  getPossibleDeliveries(id: string): Observable<PossibleDelivery[]> {
    return this.httpClient.get<PossibleDelivery[]>(environment.apiBaseUrl + '/games/' + id + '/state/possible-deliveries');
  }

  getPossibleBuys(id: string): Observable<PossibleBuy[]> {
    return this.httpClient.get<PossibleBuy[]>(environment.apiBaseUrl + '/games/' + id + '/state/possible-buys');
  }

}
