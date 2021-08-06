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
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Table} from '../../shared/model';
import {PlayerState} from '../model';

@Component({
  selector: 'app-player-buildings',
  templateUrl: './player-buildings.component.html',
  styleUrls: ['./player-buildings.component.scss']
})
export class PlayerBuildingsComponent implements OnInit {

  @Input() table: Table;
  @Input() playerState: PlayerState;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  confirm(playerBuilding: string) {
    this.ngbActiveModal.close(playerBuilding);
  }
}
