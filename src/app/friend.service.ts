/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
