import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Game, LogEntry, LogEntryType} from './model';
import {Observable} from 'rxjs';
import {environment} from '../environments/environment';
import {TranslateService} from "@ngx-translate/core";
import {GameSpecific} from "./api";

@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private httpClient: HttpClient,
              private translateService: TranslateService) {
  }

  get(): Observable<Game[]> {
    return this.httpClient.get<Game[]>(environment.apiBaseUrl + '/games');
  }

  translate(logEntry: LogEntry) {
    switch (logEntry.type) {
      case LogEntryType.IN_GAME_EVENT:
        // TODO Extract this to GWT specific logic
        switch (logEntry.parameters[0]) {
          case 'ACTION':
            return this.translateService.instant('log.' + logEntry.parameters[0] + '.' + logEntry.parameters[1],
              {
                value1: logEntry.parameters[2],
                value2: logEntry.parameters[3],
              });
          default:
            return this.translateService.instant('log.' + logEntry.parameters[0],
              {
                value1: logEntry.parameters[1],
                value2: logEntry.parameters[2],
                value3: logEntry.parameters[3],
              });
        }
      default:
        return this.translateService.instant('log.' + logEntry.type, {
            value1: logEntry.parameters[0],
            value2: logEntry.parameters[1],
            value3: logEntry.parameters[2],
          });
    }
  }
}
