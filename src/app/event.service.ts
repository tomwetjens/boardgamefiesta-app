import {Injectable} from '@angular/core';
import {webSocket} from 'rxjs/webSocket';
import {environment} from '../environments/environment';
import {BehaviorSubject, concat, of, Subject, throwError} from 'rxjs';
import {catchError, distinctUntilChanged, map, retry, switchMap} from 'rxjs/operators';
import {OAuthService} from 'angular-oauth2-oidc';
import {Event} from './shared/model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  events = new Subject<Event>();

  connected = new BehaviorSubject<boolean>(false);

  constructor(private oauthService: OAuthService) {
    concat(of({}, this.oauthService.events)).pipe(
      map((() => this.oauthService.getIdToken())),
      distinctUntilChanged(),
      switchMap(idToken => webSocket({
        url: environment.wsBaseUrl + '/events?token=' + idToken,
        openObserver: {next: () => this.connected.next(true)},
        closeObserver: {next: () => this.connected.next(false)}
      })
        // TODO Better retry
        .pipe(retry())),
      catchError(err => {
        this.connected.next(false);
        return throwError(err);
      }))
      .subscribe(message => this.events.next(message as any));
  }
}
