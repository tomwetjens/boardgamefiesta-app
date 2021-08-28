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
import {
  Action,
  ActionType,
  Card,
  CattleCard,
  CattleType,
  isCattleCard,
  isObjectiveCard,
  PlayerState,
  State,
  Worker
} from '../model';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {PlayerBuildingsComponent} from '../player-buildings/player-buildings.component';
import {AudioService} from '../../audio.service';
import {ObjectivesDialogComponent} from '../objectives-dialog/objectives-dialog.component';
import {Table} from '../../shared/model';
import {CARD, CERTIFICATE, COINS, COWBOY, CRAFTSMAN, ENGINEER} from "../sounds";
import {DiscardPileDialogComponent} from "../discard-pile-dialog/discard-pile-dialog.component";
import {DrawStackDialogComponent} from "../draw-stack-dialog/draw-stack-dialog.component";
import {bounceOutUpOnLeaveAnimation, flipInYOnEnterAnimation} from "angular-animations";

interface Branchlet {
  columnIndex: number;
  rowIndex: number;
}

@Component({
  selector: 'app-player-board',
  animations: [
    flipInYOnEnterAnimation(),
    bounceOutUpOnLeaveAnimation()
  ],
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss']
})
export class PlayerBoardComponent implements OnInit, OnDestroy, OnChanges {

  private dialog: NgbModalRef;

  @Input() table: Table;
  @Input() state: State;
  @Input() playerState: PlayerState;
  @Input() actions: ActionType[] = [];
  @Input() selectedAction: ActionType;
  @Input() readonly = false;

  @Output() perform = new EventEmitter<Action>();
  @Output() selectAction = new EventEmitter<ActionType>();

  cowboys: Worker[] = [];
  craftsmen: Worker[] = [];
  engineers: Worker[] = [];
  branchlets: Branchlet[] = [];

  get canUseExchangeToken(): boolean {
    return this.state
      && this.state.actions
      && this.state.actions.includes(ActionType.USE_EXCHANGE_TOKEN)
      && !!this.playerState.handValue;
  }

  get playerCount(): number {
    return this.state.otherPlayers.length + (!!this.state.player ? 1 : 0);
  }

  constructor(private ngbModal: NgbModal, private audioService: AudioService) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    if (this.dialog) {
      this.dialog.close();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.branchlets = Array(this.playerState.branchlets).fill(null)
      .map((_, index) => ({columnIndex: 4 - Math.floor(index / 3), rowIndex: 2 - (index % 3)}));

    this.cowboys = Array(this.playerState.cowboys - 1).fill(Worker.COWBOY);
    this.craftsmen = Array(this.playerState.craftsmen - 1).fill(Worker.CRAFTSMAN);
    this.engineers = Array(this.playerState.engineers - 1).fill(Worker.ENGINEER);

    if (changes.playerState) {
      const current = changes.playerState.currentValue as PlayerState;
      const previous = changes.playerState.previousValue as PlayerState;

      if (current && previous) {
        if (current.balance !== previous.balance) {
          this.audioService.playEffect(COINS);
        }

        if ((current.hand && previous.hand && current.hand !== previous.hand && this.isHandChanged(current.hand, previous.hand))
          // Or in case of other player, where hand is not known
          || current.handSize !== previous.handSize
          // Or when gaining a card
          || current.discardPileSize !== previous.discardPileSize) {
          this.audioService.playEffect(CARD);
        }

        if (current.cowboys > previous.cowboys) {
          this.audioService.playVoiceOver(COWBOY);
        }
        if (current.craftsmen > previous.craftsmen) {
          this.audioService.playVoiceOver(CRAFTSMAN);
        }
        if (current.engineers > previous.engineers) {
          this.audioService.playVoiceOver(ENGINEER);
        }

        // TODO Sound for removing disc

        if (current.certificates > previous.certificates) {
          this.audioService.playEffect(CERTIFICATE);
        }
      }
    }
  }

  private isHandChanged(current: Card[], previous: Card[]) {
    return current && previous && (current.length !== previous.length ||
      current.some(a => !previous.find(b => JSON.stringify(a) === JSON.stringify(b))));
  }

  clickAuxiliaryAction(actionType: string) {
    if (this.canSelectAction(actionType)) {
      this.selectAction.emit(actionType as ActionType);
    }
  }

  hasUnlocked(unlockable: string, atLeast: number = 1): boolean {
    return this.playerState && this.playerState.unlocked[unlockable] && this.playerState.unlocked[unlockable] >= atLeast;
  }

  get canUnlockWhite(): boolean {
    return this.selectedAction === ActionType.UNLOCK_WHITE || this.selectedAction === ActionType.UNLOCK_BLACK_OR_WHITE;
  }

  get canUnlockBlack(): boolean {
    return this.selectedAction === ActionType.UNLOCK_BLACK_OR_WHITE;
  }

  selectCard(card: Card) {
    if (!this.canSelectCard(card)) {
      return;
    }

    switch (this.selectedAction) {
      case ActionType.DISCARD_CARD:
      case ActionType.REMOVE_CARD:
      case ActionType.UPGRADE_SIMMENTAL:
        this.perform.emit({type: this.selectedAction, card});
        break;

      case ActionType.DISCARD_1_OBJECTIVE_CARD_TO_GAIN_2_CERTIFICATES:
      case ActionType.PLAY_OBJECTIVE_CARD:
        this.perform.emit({type: this.selectedAction, objectiveCard: card});
        break;

      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_3_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND:
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_6_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND:
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_1_CERTIFICATE:
      case ActionType.DISCARD_CATTLE_CARD_TO_GAIN_7_DOLLARS:
      case ActionType.DISCARD_CATTLE_CARD_TO_PLACE_BRANCHLET:
      case ActionType.DISCARD_PAIR_TO_GAIN_3_DOLLARS:
      case ActionType.DISCARD_PAIR_TO_GAIN_4_DOLLARS:
        this.perform.emit({type: this.selectedAction, cattleType: (card as CattleCard).type});
        break;
    }
  }

  unlock(unlock: string) {
    if ([ActionType.UNLOCK_WHITE, ActionType.UNLOCK_BLACK_OR_WHITE].includes(this.selectedAction)) {
      this.perform.emit({type: this.selectedAction, unlock});
    }
  }

  canSelectCard(card: Card) {
    switch (this.selectedAction) {
      case ActionType.DISCARD_CARD:
      case ActionType.REMOVE_CARD:
        return true;
      case ActionType.DISCARD_1_OBJECTIVE_CARD_TO_GAIN_2_CERTIFICATES:
      case ActionType.PLAY_OBJECTIVE_CARD:
        return isObjectiveCard(card);
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_3_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND:
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_6_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND:
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_1_CERTIFICATE:
      case ActionType.DISCARD_CATTLE_CARD_TO_GAIN_7_DOLLARS:
        return isCattleCard(card);
      case ActionType.DISCARD_CATTLE_CARD_TO_PLACE_BRANCHLET:
        return isCattleCard(card) && [CattleType.GUERNSEY, CattleType.BLACK_ANGUS, CattleType.DUTCH_BELT].includes(card.type);
      case ActionType.UPGRADE_SIMMENTAL:
        return isCattleCard(card) && card.type === CattleType.SIMMENTAL && card.breedingValue < 5;
      case ActionType.DISCARD_PAIR_TO_GAIN_3_DOLLARS:
      case ActionType.DISCARD_PAIR_TO_GAIN_4_DOLLARS:
        return isCattleCard(card) && this.hasPair((card as CattleCard).type);
      default:
        return false;
    }
  }

  private hasPair(cattleType: CattleType) {
    return this.playerState.hand.filter(card => isCattleCard(card) && ((card as CattleCard).type === cattleType)).length > 1;
  }

  canSelectAction(actionType: string) {
    return !this.readonly && this.state.actions && this.state.actions.includes(actionType as ActionType);
  }

  showBuildings() {
    this.dialog = this.ngbModal.open(PlayerBuildingsComponent);
    const componentInstance = this.dialog.componentInstance as PlayerBuildingsComponent;
    componentInstance.table = this.table;
    componentInstance.playerState = this.playerState;
  }

  showObjectives() {
    this.dialog = this.ngbModal.open(ObjectivesDialogComponent);
    const componentInstance = this.dialog.componentInstance as ObjectivesDialogComponent;
    componentInstance.table = this.table;
    componentInstance.playerState = this.playerState;
  }

  showDiscardPile() {
    this.dialog = this.ngbModal.open(DiscardPileDialogComponent);
    const componentInstance = this.dialog.componentInstance as DiscardPileDialogComponent;
    componentInstance.gameId = this.table.game;
    componentInstance.playerState = this.playerState;
  }

  showDrawStack() {
    this.dialog = this.ngbModal.open(DrawStackDialogComponent);
    const componentInstance = this.dialog.componentInstance as DrawStackDialogComponent;
    componentInstance.gameId = this.table.game;
    componentInstance.drawStack = this.playerState.drawStack;
  }

  canSelectCowboy(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.cowboys - 2;
  }

  selectCowboy(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.perform.emit({type: this.selectedAction, worker: Worker.COWBOY});
    }
  }

  canSelectCraftsman(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.craftsmen - 2;
  }

  selectCraftsman(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.perform.emit({type: this.selectedAction, worker: Worker.CRAFTSMAN});
    }
  }

  canSelectEngineer(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.engineers - 2;
  }

  selectEngineer(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.perform.emit({type: this.selectedAction, worker: Worker.ENGINEER});
    }
  }

  trackCardInHand(index: number, card: Card): any {
    return isObjectiveCard(card)
      ? card.action + card.points + card.penalty + card.tasks.join('')
      : card.type + card.points;
  }

  useExchangeToken() {
    if (this.canUseExchangeToken) {
      this.perform.emit({type: ActionType.USE_EXCHANGE_TOKEN});
    }
  }
}
