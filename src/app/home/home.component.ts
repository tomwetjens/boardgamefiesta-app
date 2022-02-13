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

import {Component, OnDestroy, OnInit} from '@angular/core';
import {Table, TableMode, TablePlayer, TableType} from '../shared/model';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {TableService} from '../table.service';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {GameService} from "../game.service";
import {Game} from "../model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  loggedIn$: Observable<boolean>;
  myActiveTables$: Observable<Table[]>;
  myTurnTables$: Observable<Table[]>;
  waitingTables$: Observable<Table[]>;
  games$: Observable<Game[]>;

  constructor(private router: Router,
              private authService: AuthService,
              private gameService: GameService,
              private tableService: TableService) {
    this.loggedIn$ = authService.loggedIn;
    this.games$ = gameService.list();
  }

  ngOnInit(): void {
    this.myActiveTables$ = this.tableService.myActiveTables$;

    this.myTurnTables$ = this.myActiveTables$.pipe(
      map(tables => tables.filter(table => !!table.turn))
    );

    this.waitingTables$ = this.myActiveTables$.pipe(
      map(tables => tables.filter(table => !table.turn))
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  reject(table: Table) {
    this.tableService.reject(table.id)
      .subscribe(() => this.refreshTables());
  }

  private openTable(table: Table) {
    this.router.navigate([table.game, table.id]);
  }

  private refreshTables() {
    this.tableService.refreshMyActiveTables();
  }

  play(gameId: string) {
    this.tableService.create(gameId).subscribe(table => {
      this.openTable(table);
    });
  }

  otherHumanPlayers(table: Table): TablePlayer[] {
    return table.otherPlayers.map(playerId => table.players[playerId]).filter(player => !!player.user);
  }

  initLoginFlow() {
    this.authService.initLoginFlow();
  }
}
