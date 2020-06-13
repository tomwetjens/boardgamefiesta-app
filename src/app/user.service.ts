import {Injectable} from '@angular/core';
import {User} from './shared/model';
import {Observable, of} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {environment} from '../environments/environment';
import {switchMap} from 'rxjs/operators';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  currentUser: Observable<User>;

  constructor(private httpClient: HttpClient, private authService: AuthService) {
    this.currentUser = this.authService.loggedIn.pipe(switchMap(loggedIn => {
      if (!loggedIn) {
        return of(null);
      }
      return this.authService.userId
        .pipe(switchMap(userId => this.httpClient.get<User>(environment.apiBaseUrl + '/users/' + userId)));
    }));
  }

  find(q: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/users', {params: {q}});
  }

  changeLocation(id: string, location: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-location', {location});
  }

  changeLanguage(id: string, language: string) {
    return this.httpClient.post(environment.apiBaseUrl + '/users/' + id + '/change-language', {language});
  }
}
