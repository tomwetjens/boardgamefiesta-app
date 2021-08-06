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

import {Component, Input, OnInit} from '@angular/core';
import {LocationService} from '../location.service';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-location-icon',
  templateUrl: './location-icon.component.html',
  styleUrls: ['./location-icon.component.scss']
})
export class LocationIconComponent implements OnInit {

  @Input() location: string;

  name: Observable<string>;

  constructor(private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.name = this.locationService.names
      .pipe(map(names => names[this.location]));
  }

}
