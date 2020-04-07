import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Game} from './model';
import {Observable} from 'rxjs';

export interface CreateGameRequest {
  inviteUserIds: string[];
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) { }

  create(request: CreateGameRequest): Observable<Game> {
    return this.httpClient.post<Game>(environment.apiBaseUrl + '/games/create', request);
  }

  get(id: string): Observable<Game> {
    return this.httpClient.get<Game>(environment.apiBaseUrl + '/games/' + id);
  }

  start(id: string): Observable<Game> {
    return this.httpClient.post<Game>(environment.apiBaseUrl + '/games/' + id + '/start', null);
  }
}
