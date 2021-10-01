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
import {TableService} from "../table.service";
import {TitleService} from "../title.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TableMode, TableType} from "../shared/model";

@Component({
  selector: 'app-game-tables',
  templateUrl: './game-tables.component.html',
  styleUrls: ['./game-tables.component.scss']
})
export class GameTablesComponent implements OnInit {

  gameId$: Observable<string>;

  constructor(private titleService: TitleService,
              private translateService: TranslateService,
              private tableService: TableService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.gameId$ = this.route.params.pipe(
      map(({gameId}) => gameId));

    this.titleService.setTitle(this.translateService.instant('startedTables'));
  }

  createTable(gameId: string) {
    this.tableService.create(gameId).subscribe(table => {
      this.router.navigate([table.game, table.id]);
    });
  }
}
