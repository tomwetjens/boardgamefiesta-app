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

import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {Action, BigBazar, BonusCard, Caravansary, Market, MosqueTile, Place, PlayerState} from '../model';
import {PlayerColor, Table, TablePlayer} from '../../shared/model';
import {TranslateService} from '@ngx-translate/core';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SellGoodsDialogComponent} from '../sell-goods-dialog/sell-goods-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {GuessDialogComponent} from '../guess-dialog/guess-dialog.component';
import {MessageDialogComponent} from '../../shared/message-dialog/message-dialog.component';
import {ConfirmBonusCardDialogComponent} from "../confirm-bonus-card-dialog/confirm-bonus-card-dialog.component";
import {DiscardPileDialogComponent} from "../discard-pile-dialog/discard-pile-dialog.component";

const AUTO_SELECTED_ACTIONS = [Action.MOVE];

@Component({
  selector: 'app-big-bazar-board',
  templateUrl: './big-bazar-board.component.html',
  styleUrls: ['./big-bazar-board.component.scss']
})
export class BigBazarBoardComponent implements OnInit, OnChanges {

  @Input() state: BigBazar;
  @Input() table: Table;
  @Input() busy: boolean;

  @Output() perform = new EventEmitter<any>();

  selectedAction: Action;

  Math = window.Math;

  private player: TablePlayer;
  private playerState: PlayerState;
  private currentPlace: { x, y: number };

  constructor(private translateService: TranslateService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.ngOnChanges({
      table: new SimpleChange(undefined, this.table, true),
      state: new SimpleChange(undefined, this.state, true)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.table) {
      this.player = this.table.player ? this.table.players[this.table.player] : null;
    }

    if (this.player && this.state) {
      this.playerState = this.state.players[this.player.color];
      this.currentPlace = this.getCurrentPlace(this.player.color);

      this.autoSelectAction();
    }
  }

  private getCurrentPlace(color: PlayerColor): { x, y: number } {
    for (let x = 0; x < this.state.layout.length; x++) {
      for (let y = 0; y < this.state.layout[x].length; y++) {
        const place = this.state.layout[x][y];
        if (place.merchants && place.merchants.find(merchant => merchant.color === color)) {
          return {x, y};
        }
      }
    }
    return null;
  }

  private getPlace(n: number): Place {
    for (let x = 0; x < this.state.layout.length; x++) {
      for (let y = 0; y < this.state.layout[x].length; y++) {
        const place = this.state.layout[x][y];
        if (place.number === n) {
          return place;
        }
      }
    }
    return null;
  }

  private getCurrentFamilyMemberPlace(color: PlayerColor): Place {
    for (let x = 0; x < this.state.layout.length; x++) {
      for (let y = 0; y < this.state.layout[x].length; y++) {
        const place = this.state.layout[x][y];
        if (place.familyMembers && place.familyMembers.find(fm => fm === color)) {
          return place;
        }
      }
    }
    return null;
  }

  private autoSelectAction() {
    if (this.selectedAction && (!this.state.actions || !this.state.actions.includes(this.selectedAction))) {
      this.selectedAction = null;
    }

    if (!this.selectedAction && this.state.actions && this.state.actions.length === 1) {
      for (const action of AUTO_SELECTED_ACTIONS) {
        if (this.state.actions.includes(action)) {
          this.selectAction(action);
          break;
        }
      }
    } else if (this.selectedAction) {
      this.selectAction(this.selectedAction);
    }
  }

  selectAction(action: string) {
    switch (action as Action) {
      case Action.MOVE:
      case Action.SEND_FAMILY_MEMBER:
      case Action.TAKE_MOSQUE_TILE:
      case Action.PAY_2_LIRA_TO_RETURN_ASSISTANT:
      case Action.RETURN_1_ASSISTANT:
        this.selectedAction = action as Action;
        // Something becomes selectable
        break;

      case Action.DISCARD_BONUS_CARD:
        return this.discardBonusCard(action);

      case Action.SELL_GOODS:
        return this.sellGoods();

      case Action.GUESS_AND_ROLL_FOR_LIRA:
        return this.guessAndRollForLira();

      case Action.TAKE_BONUS_CARD_CARAVANSARY:
        return this.takeBonusCardCaravansary();

      default:
        this.selectedAction = null;
        this.perform.emit({type: action});
    }
  }

  private discardBonusCard(action: string) {
    if (this.playerState && this.playerState.bonusCards.length === 1) {
      this.perform.emit({type: action, bonusCard: this.playerState.bonusCards[0]});
    } else {
      this.selectedAction = action as Action;
    }
  }

  private sellGoods() {
    const ngbModalRef = this.ngbModal.open(SellGoodsDialogComponent);

    const componentInstance = ngbModalRef.componentInstance as SellGoodsDialogComponent;
    componentInstance.market = [10, 11].includes(this.state.layout[this.currentPlace.x][this.currentPlace.y].number)
      ? this.state.layout[this.currentPlace.x][this.currentPlace.y] as Market
      : this.getCurrentFamilyMemberPlace(this.table.players[this.table.player].color) as Market;
    componentInstance.playerState = this.playerState;

    fromPromise(ngbModalRef.result)
      .subscribe(({goods, bonusCard}) => {
        this.perform.emit({type: Action.SELL_GOODS, goods, bonusCard});
      }, () => {
      });
  }

  private guessAndRollForLira() {
    const ngbModalRef = this.ngbModal.open(GuessDialogComponent);

    fromPromise(ngbModalRef.result)
      .subscribe(guess => {
        this.perform.emit({type: Action.GUESS_AND_ROLL_FOR_LIRA, guess});
      });
  }

  canSelectPlace(x: number, y: number): boolean {
    if (!this.currentPlace) {
      return false;
    }

    switch (this.selectedAction) {
      case Action.MOVE:
        let atLeast = 1;
        let atMost = 2;
        if (this.playerState.bonusCards.includes(BonusCard.MOVE_0)) {
          atLeast = 0;
        }
        if (this.playerState.bonusCards.includes(BonusCard.MOVE_3_OR_4)) {
          atMost = 4;
        }

        const distance = Math.abs(this.currentPlace.x - x) + Math.abs(this.currentPlace.y - y);

        return distance >= atLeast && distance <= atMost;

      case Action.SEND_FAMILY_MEMBER:
        return x !== this.currentPlace.x || y !== this.currentPlace.y;

      case Action.RETURN_1_ASSISTANT:
      case Action.PAY_2_LIRA_TO_RETURN_ASSISTANT:
        return this.state.layout[x][y].assistants && this.state.layout[x][y].assistants[this.player.color] > 0;

      default:
        return false;
    }
  }

  selectPlace(x: number, y: number) {
    if (!this.canSelectPlace(x, y)) {
      return;
    }

    switch (this.selectedAction) {
      case Action.MOVE:
        const distance = Math.abs(this.currentPlace.x - x) + Math.abs(this.currentPlace.y - y);

        let bonusCard: BonusCard;
        if (distance === 0) {
          bonusCard = BonusCard.MOVE_0;
        } else if (distance >= 3) {
          bonusCard = BonusCard.MOVE_3_OR_4;
        }

        if (bonusCard) {
          const ngbModalRef = this.ngbModal.open(ConfirmBonusCardDialogComponent);
          const componentInstance = ngbModalRef.componentInstance as ConfirmBonusCardDialogComponent;
          componentInstance.bonusCard = bonusCard;
          fromPromise(ngbModalRef.result).subscribe(() =>
            this.perform.emit({type: Action.MOVE, x, y, bonusCard}));
        } else {
          // No bonus card needed
          this.perform.emit({type: Action.MOVE, x, y});
        }
        break;

      default:
        this.perform.emit({type: this.selectedAction, x, y});
        break;
    }
  }

  private takeBonusCardCaravansary() {
    const caravansary = this.getPlace(6) as Caravansary;

    if (caravansary.discardPile && caravansary.discardPile.length > 0) {
      const ngbModalRef = this.ngbModal.open(MessageDialogComponent);

      const componentInstance = ngbModalRef.componentInstance as MessageDialogComponent;
      componentInstance.type = 'confirm';
      componentInstance.titleKey = 'big-bazar.caravansaryConfirmDialog';
      componentInstance.messageKey = 'big-bazar.caravansaryConfirmMessage';
      componentInstance.confirmKey = 'big-bazar.takeFromDiscardPile';
      componentInstance.cancelKey = 'big-bazar.takeFromDrawStack';

      fromPromise(ngbModalRef.result)
        .subscribe(() => this.perform.emit({type: Action.TAKE_BONUS_CARD_CARAVANSARY, caravansary: true}),
          () => this.perform.emit({type: Action.TAKE_BONUS_CARD_CARAVANSARY, caravansary: false}));
    } else {
      this.perform.emit({type: Action.TAKE_BONUS_CARD_CARAVANSARY, caravansary: false});
    }
  }

  canSelectMosqueTile(mosqueTile: string): boolean {
    return [Action.TAKE_MOSQUE_TILE].includes(this.selectedAction)
      && !this.playerState.mosqueTiles.includes(mosqueTile as MosqueTile);
  }

  selectMosqueTile(mosqueTile: string) {
    if (!this.canSelectMosqueTile(mosqueTile)) {
      return;
    }

    this.perform.emit({type: this.selectedAction, mosqueTile: mosqueTile as MosqueTile});
  }

  showDiscardPile(discardPile: BonusCard[]) {
    const ngbModalRef = this.ngbModal.open(DiscardPileDialogComponent);

    const componentInstance = ngbModalRef.componentInstance as DiscardPileDialogComponent;
    componentInstance.discardPile = discardPile;

    fromPromise(ngbModalRef.result)
      .subscribe(() => {
      }, () => {});
  }
}
