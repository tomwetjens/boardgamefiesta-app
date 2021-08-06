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

import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {filter} from "rxjs/operators";

interface DonationsStatus {
  needs?: number;
  percent?: number;
}

@Component({
  selector: 'app-donations-status',
  templateUrl: './donations-status.component.html',
  styleUrls: ['./donations-status.component.scss']
})
export class DonationsStatusComponent implements OnInit {

  status$: Observable<DonationsStatus>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.status$ = this.httpClient.get<DonationsStatus>(environment.apiBaseUrl + '/donations/status')
      .pipe(filter(status => !!status.needs && !!status.percent));
  }

}
