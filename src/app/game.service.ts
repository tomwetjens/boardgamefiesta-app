import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {CreateTableRequest, Game, Table} from './model';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) {
  }

  get(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(environment.apiBaseUrl + '/games');
  }
}
