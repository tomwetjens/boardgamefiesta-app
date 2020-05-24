import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Game, LogEntry, LogEntryType, Table, TablePlayer} from './shared/model';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {TranslateService} from '@ngx-translate/core';

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
