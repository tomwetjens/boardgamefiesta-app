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

import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, PlayerState, State} from '../model';
import {AudioService} from '../../audio.service';
import {Table} from '../../shared/model';
import {MessageDialogComponent} from '../../shared/message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OPENING_MUSIC, SOUNDS} from '../sounds';
import {EndedDialogComponent} from '../ended-dialog/ended-dialog.component';
import {interval, Subject, Subscription} from "rxjs";
import {takeUntil} from "rxjs/operators";

const AUTO_SELECTED_ACTIONS = [
  ActionType.PLACE_BID,
  ActionType.MOVE,
  ActionType.DISCARD_CARD,
  ActionType.CHOOSE_FORESIGHT_1,
  ActionType.CHOOSE_FORESIGHT_2,
  ActionType.CHOOSE_FORESIGHT_3,
  ActionType.DELIVER_TO_CITY,
  ActionType.UNLOCK_WHITE,
  ActionType.UNLOCK_BLACK_OR_WHITE,
  ActionType.DOWNGRADE_STATION,
  ActionType.PLACE_BRANCHLET,
  ActionType.UPGRADE_SIMMENTAL
];

const DIRECT_ACTIONS = [
  ActionType.DISCARD_1_DUTCH_BELT_TO_GAIN_2_DOLLARS,
  ActionType.DISCARD_1_DUTCH_BELT_TO_GAIN_3_DOLLARS,
  ActionType.GAIN_2_DOLLARS,
  ActionType.GAIN_1_DOLLAR,
  ActionType.GAIN_1_CERTIFICATE,
  ActionType.DRAW_CARD,
  ActionType.DRAW_2_CARDS,
  ActionType.DRAW_3_CARDS,
  ActionType.DRAW_4_CARDS,
  ActionType.DRAW_5_CARDS,
  ActionType.DRAW_6_CARDS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE,
  ActionType.DISCARD_1_JERSEY_FOR_SINGLE_AUXILIARY_ACTION,
  ActionType.DISCARD_1_GUERNSEY,
  ActionType.DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS,
  ActionType.DISCARD_1_DUTCH_BELT_TO_MOVE_ENGINE_2_FORWARD,
  ActionType.SINGLE_AUXILIARY_ACTION,
  ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION,
  ActionType.DISCARD_1_BLACK_ANGUS_TO_GAIN_2_CERTIFICATES,
  ActionType.DISCARD_1_HOLSTEIN_TO_GAIN_10_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE_AND_2_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_MOVE_ENGINE_1_FORWARD,
  ActionType.DISCARD_1_GUERNSEY_TO_GAIN_4_DOLLARS,
  ActionType.DRAW_2_CATTLE_CARDS,
  ActionType.GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS,
  ActionType.GAIN_2_DOLLARS_PER_STATION,
  ActionType.GAIN_1_DOLLAR_PER_ENGINEER,
  ActionType.GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR,
  ActionType.GAIN_4_DOLLARS,
  ActionType.GAIN_12_DOLLARS,
  ActionType.MAX_CERTIFICATES,
  ActionType.UPGRADE_STATION,
  ActionType.GAIN_EXCHANGE_TOKEN,
  ActionType.GAIN_1_DOLLAR_PER_CRAFTSMAN,
  ActionType.GAIN_1_CERTIFICATE_AND_1_DOLLAR_PER_BELL,
  ActionType.GAIN_2_CERTIFICATES,
  ActionType.GAIN_3_DOLLARS,
  ActionType.GAIN_5_DOLLARS,
  ActionType.UPGRADE_STATION_TOWN
];

const CANNOT_UNDO_ACTIONS = [
  ActionType.DRAW_CARD,
  ActionType.DRAW_2_CARDS,
  ActionType.DRAW_3_CARDS,
  ActionType.DRAW_4_CARDS,
  ActionType.DRAW_5_CARDS,
  ActionType.DRAW_6_CARDS,
  ActionType.DRAW_2_CATTLE_CARDS,
  ActionType.TAKE_OBJECTIVE_CARD,
  ActionType.ADD_1_OBJECTIVE_CARD_TO_HAND
];

const FREE_ACTIONS = [
  ActionType.DRAW_CARD,
  ActionType.DRAW_2_CARDS,
  ActionType.DRAW_3_CARDS,
  ActionType.DRAW_4_CARDS,
  ActionType.DRAW_5_CARDS,
  ActionType.DRAW_6_CARDS,
  ActionType.GAIN_1_CERTIFICATE,
  ActionType.GAIN_1_DOLLAR,
  ActionType.GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS,
  ActionType.GAIN_2_DOLLARS_PER_STATION,
  ActionType.GAIN_1_DOLLAR_PER_ENGINEER,
  ActionType.GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR,
  ActionType.GAIN_2_DOLLARS,
  ActionType.GAIN_4_DOLLARS,
  ActionType.GAIN_12_DOLLARS,
  ActionType.MAX_CERTIFICATES,
  ActionType.MOVE_1_FORWARD,
  ActionType.MOVE_2_FORWARD,
  ActionType.MOVE_3_FORWARD,
  ActionType.MOVE_3_FORWARD_WITHOUT_FEES,
  ActionType.MOVE_4_FORWARD,
  ActionType.MOVE_5_FORWARD,
  ActionType.MOVE_ENGINE_1_FORWARD,
  ActionType.MOVE_ENGINE_2_FORWARD,
  ActionType.MOVE_ENGINE_2_OR_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_2_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_4_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_HAZARDS,
  ActionType.REMOVE_HAZARD_FOR_FREE,
  ActionType.SINGLE_AUXILIARY_ACTION,
  ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION,
  ActionType.UPGRADE_ANY_STATION_BEHIND_ENGINE,
  ActionType.UPGRADE_STATION,
  ActionType.USE_ADJACENT_BUILDING,
  ActionType.GAIN_EXCHANGE_TOKEN,
  ActionType.GAIN_1_DOLLAR_PER_CRAFTSMAN,
  ActionType.GAIN_1_CERTIFICATE_AND_1_DOLLAR_PER_BELL,
  ActionType.GAIN_2_CERTIFICATES,
  ActionType.GAIN_3_DOLLARS,
  ActionType.GAIN_5_DOLLARS,
  ActionType.UPGRADE_STATION_TOWN,
  ActionType.TAKE_BREEDING_VALUE_3_CATTLE_CARD,
  ActionType.UPGRADE_SIMMENTAL
];

@Component({
  selector: 'app-gwt-board',
  templateUrl: './gwt-board.component.html',
  styleUrls: ['./gwt-board.component.scss']
})
export class GwtBoardComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();

  private dialog: NgbModalRef;

  @Input() table: Table;
  @Input() state: State;
  @Input() busy: boolean;

  actions: ActionType[];
  selectedAction: ActionType;
  @Output() perform = new EventEmitter<Action>();
  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  constructor(private audioService: AudioService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.audioService.preload(SOUNDS);

    if (this.state) {
      if (this.state.player
        && !this.state.trail.playerLocations[this.state.player.player.color]
        && !this.audioService.isPlayingMusic) {
        // Before player did first move
        this.audioService.playMusic(OPENING_MUSIC);
      }

      this.stateChanged(this.state, undefined);
    }
  }

  ngOnDestroy(): void {
    if (this.dialog) {
      this.dialog.close();
    }

    this.destroyed.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      const currentState = changes.state.currentValue as State;
      const previousState = changes.state.previousValue as State;

      this.stateChanged(currentState, previousState);
    }
  }

  get autoEndTurn(): boolean {
    return this.state?.turn && !this.state?.ended
      && this.state?.actions?.filter(action => action !== ActionType.USE_EXCHANGE_TOKEN).length === 0;
  }

  private stateChanged(currentState: State, previousState: State) {
    this.actions = currentState.actions
      ? currentState.actions.filter(action => action !== ActionType.USE_EXCHANGE_TOKEN)
      : [];

    if (currentState.turn) {
      if (this.actions.length === 1
        && AUTO_SELECTED_ACTIONS.includes(this.actions[0])) {
        this.selectedAction = this.actions[0];
      } else {
        this.selectedAction = null;
      }
    } else {
      this.selectedAction = null;
    }

    if (currentState.ended) {
      this.selectedAction = null;

      if (!this.dialog) {
        this.dialog = this.ngbModal.open(EndedDialogComponent, {scrollable: true, size: 'lg'});

        const componentInstance = this.dialog.componentInstance as EndedDialogComponent;
        componentInstance.table = this.table;
        componentInstance.state = currentState;

        fromPromise(this.dialog.result).subscribe({
          error: () => this.dialog = null,
          complete: () => this.dialog = null
        });
      }
    }
  }

  doEndTurn() {
    if (this.canPerformFreeAction) {
      this.dialog = this.ngbModal.open(MessageDialogComponent);
      const messageDialogComponent = this.dialog.componentInstance as MessageDialogComponent;
      messageDialogComponent.type = 'confirm';
      messageDialogComponent.messageKey = 'gwt.confirmEndTurn';
      messageDialogComponent.confirmKey = 'endTurn';
      messageDialogComponent.cancelKey = 'cancel';
      fromPromise(this.dialog.result).subscribe(() => this.endTurn.emit(),
        () => this.dialog = null,
        () => this.dialog = null);
    } else {
      this.endTurn.emit();
    }
  }

  trackPlayerState(index: number, playerState: PlayerState) {
    return playerState.player.name;
  }

  get canSkip(): boolean {
    return this.state.turn && this.actions && this.actions.length > 0;
  }

  get canPerformFreeAction(): boolean {
    return this.state.actions && this.state.actions.some(action => FREE_ACTIONS.includes(action));
  }

  selectAction(actionType: string) {
    if (DIRECT_ACTIONS.includes(actionType as ActionType)) {
      if (CANNOT_UNDO_ACTIONS.includes(actionType as ActionType)) {
        this.confirmCannotUndo().subscribe(() =>
          this.perform.emit({type: actionType as ActionType}));
      } else {
        this.perform.emit({type: actionType as ActionType});
      }
    } else {
      this.selectedAction = actionType as ActionType;
    }
  }

  private confirmCannotUndo() {
    const ngbModalRef = this.ngbModal.open(MessageDialogComponent);

    const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
    messageDialogComponent.type = 'confirm';
    messageDialogComponent.messageKey = 'gwt.confirmCannotUndo';
    messageDialogComponent.confirmKey = 'confirm';
    messageDialogComponent.cancelKey = 'cancel';

    return fromPromise(ngbModalRef.result);
  }

  doUndo() {
    this.undo.emit();
  }
}
