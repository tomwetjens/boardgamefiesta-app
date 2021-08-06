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
import {TableService} from "../table.service";
import {Table} from "../shared/model";
import {fadeInOnEnterAnimation} from "angular-animations";

@Component({
  animations: [
    fadeInOnEnterAnimation()
  ],
  selector: 'app-started-tables',
  templateUrl: './started-tables.component.html',
  styleUrls: ['./started-tables.component.scss']
})
export class StartedTablesComponent implements OnInit {

  @Input() gameId: string;

  tables: Table[] = [];
  loading = false;
  hasMore = false;

  constructor(private tableService: TableService) {
  }

  ngOnInit(): void {
    this.loading = true;
    this.tableService.findStarted(this.gameId).subscribe(response => {
      Array.prototype.push.apply(this.tables, response);
      this.hasMore = response.length == 20;
    }, err => this.loading = false);
  }

  showMore() {
    const last = this.tables[this.tables.length - 1];

    this.loading = true;
    this.tableService.findStarted(this.gameId, last.started, last.id)
      .subscribe(response => {
        Array.prototype.push.apply(this.tables, response);
        this.loading = false;
        this.hasMore = response.length == 20;
      }, err => this.loading = false);
  }
}
