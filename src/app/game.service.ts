import { Injectable } from '@angular/core';
import {Observable} from "rxjs";
import {User} from "./shared/model";
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";

export interface Ranking {
  user: User;
  rating: number;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient) { }

  getRanking(gameId: string): Observable<Ranking[]> {
    return this.httpClient.get<Ranking[]>(environment.apiBaseUrl + '/games/' + gameId + '/ranking');
  }
}
