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

import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocationService} from '../shared/location.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {

  @Input() value?: string;

  @Output() changeLocation = new EventEmitter<string>();

  codes: string[];
  names: { [code: string]: string };

  constructor(private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.codes = this.locationService.codes;

    this.locationService.names
      .subscribe(names => {
        this.names = names;
        this.codes.sort((a, b) => this.names[a].localeCompare(this.names[b]));
      });
  }

}
