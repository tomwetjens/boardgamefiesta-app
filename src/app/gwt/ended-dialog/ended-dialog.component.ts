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

import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Table, TablePlayer} from '../../shared/model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {City, PlayerState, ScoreCategory, State} from '../model';
import {AudioService} from "../../audio.service";
import {SCORE_MUSIC} from "../sounds";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

interface Column {
  player: TablePlayer;
  playerState: PlayerState;
  total: number;
}

interface Row {
  category: ScoreCategory;
  scores: number[];
}

@Component({
  selector: 'app-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();

  @Input() table: Table;
  @Input() state: State;

  cities: City[];
  buildings: string[];

  constructor(public ngbActiveModal: NgbActiveModal,
              private audioService: AudioService) {
  }

  ngOnInit(): void {
    this.audioService.playMusic(SCORE_MUSIC)
      .pipe(takeUntil(this.destroyed))
      .subscribe();

    this.cities = this.state.railsToTheNorth
      ? [City.KANSAS_CITY,
        City.COLUMBIA,
        City.ST_LOUIS,
        City.CHICAGO,
        City.DETROIT,
        City.CLEVELAND,
        City.PITTSBURGH,
        City.NEW_YORK_CITY,
        City.MEMPHIS,
        City.SAN_FRANCISCO,
        City.DENVER,
        City.MILWAUKEE,
        City.GREEN_BAY,
        City.TORONTO,
        City.MINNEAPOLIS,
        City.MONTREAL]
      : [City.KANSAS_CITY,
        City.TOPEKA,
        City.WICHITA,
        City.COLORADO_SPRINGS,
        City.SANTA_FE,
        City.ALBUQUERQUE,
        City.EL_PASO,
        City.SAN_DIEGO,
        City.SACRAMENTO,
        City.SAN_FRANCISCO];

    this.buildings = Array.from(
      new Set<string>([
        ...[this.state.player, ...this.state.otherPlayers]
          .filter(playerState => !!playerState)
          .flatMap(playerState => playerState.buildings),
        ...Object.keys(this.state.trail.locations)
          .map(name => this.state.trail.locations[name])
          .map(location => location.building?.name)
          .filter(building => !!building)])
        .values())
      .sort((a, b) => {
        let result = a.length - b.length;
        if (result == 0) {
          result = a.toLowerCase().localeCompare(b.toLowerCase());
        }
        return result;
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get rows(): Row[] {
    return Object.keys(ScoreCategory)
      .map(category => ({
        category: category as ScoreCategory,
        scores: [this.state.player, ...this.state.otherPlayers]
          .filter(player => !!player)
          .map(player => player.score.categories[category] || 0)
      }));
  }

  get columns(): Column[] {
    return [this.state.player, ...this.state.otherPlayers]
      .filter(player => !!player)
      .map(playerState => ({
        player: this.table.players[playerState.player.name],
        playerState,
        total: playerState.score.total
      }));
  }

}
