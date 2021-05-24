import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table, TablePlayer} from "../../shared/model";
import {Action, BigBazar, BonusCard, GoodsType, MosqueTile} from "../model";

@Component({
  selector: 'big-bazar-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() table: Table;
  @Input() player: TablePlayer;
  @Input() state: BigBazar;
  @Input() selectedAction: Action;

  @Input() summary: boolean;

  @Output() perform = new EventEmitter<any>();

  goodsTypes: GoodsType[] = Object.keys(GoodsType).map(key => key as GoodsType);

  constructor() { }

  ngOnInit(): void {
  }

  canSelectBonusCard(bonusCard: BonusCard): boolean {
    return [Action.DISCARD_BONUS_CARD].includes(this.selectedAction);
  }

  selectBonusCard(bonusCard: BonusCard) {
    switch (this.selectedAction) {
      case Action.DISCARD_BONUS_CARD:
        this.perform.emit({type: this.selectedAction, bonusCard});
        break;
    }
  }

  canSelectMosqueTile(mosqueTile: string): boolean {
    return [Action.TAKE_MOSQUE_TILE].includes(this.selectedAction)
      && !this.state.players[this.player.color].mosqueTiles.includes(mosqueTile as MosqueTile);
  }

  selectMosqueTile(mosqueTile: string) {
    if (!this.canSelectMosqueTile(mosqueTile)) {
      return;
    }

    this.perform.emit({type: Action.TAKE_MOSQUE_TILE, mosqueTile: mosqueTile as MosqueTile});
  }
}
