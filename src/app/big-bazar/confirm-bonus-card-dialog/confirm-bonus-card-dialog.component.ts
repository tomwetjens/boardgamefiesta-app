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
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BonusCard} from "../model";

@Component({
  selector: 'big-bazar-confirm-bonus-card-dialog',
  templateUrl: './confirm-bonus-card-dialog.component.html',
  styleUrls: ['./confirm-bonus-card-dialog.component.scss']
})
export class ConfirmBonusCardDialogComponent implements OnInit {

  @Input() bonusCard: BonusCard;

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
