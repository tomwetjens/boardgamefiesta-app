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
import {Observable} from "rxjs";
import {Table} from "../../shared/model";
import {Action, State} from "../../gwt/model";
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../../table.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'power-grid',
  templateUrl: './power-grid.component.html',
  styleUrls: ['./power-grid.component.scss']
})
export class PowerGridComponent implements OnInit {

  table$: Observable<Table>;
  state$: Observable<State>;
  canSkip$: Observable<boolean>;

  busy = false;

  constructor(private route: ActivatedRoute,
              private tableService: TableService) {
    this.table$ = this.tableService.table$;
    this.state$ = this.tableService.state$;
    this.canSkip$ = this.state$.pipe(map(state => state && state.actions && state.actions.length > 0));
  }

  ngOnInit(): void {
  }

  perform(table: Table, action: Action) {
    this.busy = true;
    this.tableService.perform(table.id, action)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

  skip(table: Table) {
    this.busy = true;
    this.tableService.skip(table.id)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

  endTurn(table: Table) {
    this.busy = true;
    this.tableService.endTurn(table.id)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

  undo(table: Table) {
    this.busy = true;
    this.tableService.undo(table.id)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

}
