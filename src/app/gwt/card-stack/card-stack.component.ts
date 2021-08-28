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
import {Card} from '../model';

@Component({
    selector: 'app-card-stack',
    templateUrl: './card-stack.component.html',
    styleUrls: ['./card-stack.component.scss']
})
export class CardStackComponent implements OnInit {

    @Input() gameId: string;
    @Input() cards: Card[];
    @Input() size: number;
    @Input() emptyType: 'CATTLE' | 'OBJECTIVE';

    constructor() {
    }

    ngOnInit(): void {
    }

    get stack(): Card[] {
        return this.cards;
    }

}
