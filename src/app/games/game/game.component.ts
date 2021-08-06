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
import {ActivatedRoute, Router} from "@angular/router";
import {TableMode, TableType} from "../../shared/model";
import {TableService} from "../../table.service";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../../auth.service";
import {TitleService} from "../../title.service";

interface Game {
  readonly id: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game$: Observable<Game>;
  loggedIn$: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private titleService: TitleService,
              private authService: AuthService,
              private translateService: TranslateService,
              private tableService: TableService) {
  }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.loggedIn.asObservable();

    this.game$ = this.route.params
      .pipe(map(params => ({id: params.id})));

    this.game$.subscribe(game => {
      const name = this.translateService.instant('game.' + game.id + '.name');
      if (name) {
        this.titleService.setTitle(name);
      }
    });
  }

  play(game: Game) {
    this.tableService.create({
      game: game.id,
      type: TableType.REALTIME,
      mode: TableMode.NORMAL
    }).subscribe(table => {
      this.router.navigate([table.game, table.id]);
    });
  }

}
