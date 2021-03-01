import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../environments/environment";
import {AddFriendRequest} from "./model";
import {Observable} from "rxjs";
import {User} from "./shared/model";

@Injectable({
  providedIn: 'root'
})
export class FriendService {

  constructor(private httpClient: HttpClient) {
  }

  get(userId: string): Observable<User[]> {
    return this.httpClient.get<User[]>(environment.apiBaseUrl + '/users/' + userId + '/friends');
  }

  add(userId: string): Observable<any> {
    return this.httpClient.post<AddFriendRequest>(environment.apiBaseUrl + '/friends', {userId});
  }

  remove(userId: string): Observable<any> {
    return this.httpClient.delete(environment.apiBaseUrl + '/friends/' + userId);
  }

}
