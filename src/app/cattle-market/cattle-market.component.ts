import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, CattleCard, CattleMarket} from '../model';

@Component({
  selector: 'app-cattle-market',
  templateUrl: './cattle-market.component.html',
  styleUrls: ['./cattle-market.component.scss']
})
export class CattleMarketComponent implements OnInit {

  @Input() cattleMarket: CattleMarket;
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  get cards(): CattleCard[] {
    return this.cattleMarket.cards.sort((a, b) => b.breedingValue - a.breedingValue);
  }

  canSelectCard(card: CattleCard) {
    // TODO Determine possible buys
    return ['BUY_CATTLE'].includes(this.selectedAction);
  }

  selectCard(card: CattleCard) {
    console.log('selectCard: ', card);
    if (this.selectedAction === 'BUY_CATTLE') {
      // TODO Add card to selected cards
      this.action.emit({type: this.selectedAction, cattleCards: [card]});
    }
  }
}
