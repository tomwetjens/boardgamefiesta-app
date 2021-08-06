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

import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Teepee} from '../model';

@Component({
  selector: 'app-teepee',
  templateUrl: './teepee.component.html',
  styleUrls: ['./teepee.component.scss']
})
export class TeepeeComponent implements OnInit {

  @Input() teepee: Teepee;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostBinding('class')
  get className(): string {
    return this.teepee.toString();
  }
}
