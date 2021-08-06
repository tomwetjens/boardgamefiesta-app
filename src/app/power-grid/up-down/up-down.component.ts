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

@Component({
  selector: 'power-grid-up-down',
  templateUrl: './up-down.component.html',
  styleUrls: ['./up-down.component.scss']
})
export class UpDownComponent implements OnInit {

  @Input() value: number;
  @Input() step = 1;
  @Input() min = 0;
  @Input() max = Number.MAX_VALUE;

  @Output() valueChange = new EventEmitter<number>();

  constructor() {
  }

  ngOnInit(): void {
  }

  up() {
    this.value = Math.min(this.max, this.value + this.step);
    this.valueChange.emit(this.value);
  }

  down() {
    this.value = Math.max(this.min, this.value - this.step);
    this.valueChange.emit(this.value);
  }
}
