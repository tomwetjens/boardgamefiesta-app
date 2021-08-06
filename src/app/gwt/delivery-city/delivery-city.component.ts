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
import {PlayerState, PossibleDelivery} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

interface Option {
  perm: number;
  temp: number;
}

@Component({
  selector: 'app-delivery-city',
  templateUrl: './delivery-city.component.html',
  styleUrls: ['./delivery-city.component.scss']
})
export class DeliveryCityComponent implements OnInit {

  @Input() playerState: PlayerState;
  @Input() possibleDelivery: PossibleDelivery;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  get perm(): Option[] {
    return Array(this.playerState.certificates - this.playerState.tempCertificates + 1)
      .fill(0)
      .map((_, index) => index)
      .filter(perm => perm >= this.possibleDelivery.certificates)
      .map(perm => ({perm, temp: 0}));
  }

  get both(): Option[] {
    const perm = this.playerState.certificates - this.playerState.tempCertificates;

    return Array(this.playerState.tempCertificates)
      .fill(0)
      .map((_, index) => index + 1)
      .filter(temp => this.playerState.tempCertificates !== 6 || temp !== 1) // cannot move marker from 6 to 5, only to 4
      .filter(temp => perm + temp >= this.possibleDelivery.certificates)
      .map(temp => ({perm, temp}));
  }

}
