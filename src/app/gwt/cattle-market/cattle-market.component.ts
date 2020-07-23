import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, CattleCard, CattleMarket, CostPreference, State} from '../model';
import {TableService} from '../../table.service';
import {AudioService} from '../../audio.service';
import {Table} from '../../shared/model';
import {COW} from "../sounds";

@Component({
  selector: 'app-cattle-market',
  templateUrl: './cattle-market.component.html',
  styleUrls: ['./cattle-market.component.scss']
})
export class CattleMarketComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() state: State;

  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  selectedCards: CattleCard[] = [];

  get canConfirm(): boolean {
    if (this.selectedCards.length === 0) {
      return false;
    }
    return !!this.state.possibleBuys
      .find(pb => pb.breedingValue === this.selectedCards[0].breedingValue
        && pb.pair === (this.selectedCards.length === 2));
  }

  get buyingCattle(): boolean {
    return this.selectedAction === ActionType.BUY_CATTLE;
  }

  constructor(private tableService: TableService, private audioService: AudioService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cattleMarket) {
      const current = changes.cattleMarket.currentValue as CattleMarket;
      const previous = changes.cattleMarket.previousValue as CattleMarket;

      if (current && previous) {
        if (current.cards.length !== previous.cards.length) {
          this.audioService.playSound(COW);
        }
      }
    }
  }

  canSelectCard(card: CattleCard) {
    return this.buyingCattle
      && !!this.state.possibleBuys.find(pb => pb.breedingValue === card.breedingValue);
  }

  selectCard(card: CattleCard) {
    if (!this.canSelectCard(card)) {
      return;
    }

    const index = this.selectedCards.indexOf(card);

    if (index < 0) {
      if (this.selectedCards.length === 2) {
        this.selectedCards.splice(0, 1);
      }
      if (this.selectedCards.length > 0
        && (this.selectedCards[0].breedingValue !== card.breedingValue /*Switching breeding values*/
          || !this.state.possibleBuys.find(pb => pb.breedingValue === card.breedingValue && pb.pair) /*Pair not possible*/)) {
        this.selectedCards = [card];
      } else {
        this.selectedCards.push(card);
      }
    } else {
      this.selectedCards.splice(index, 1);
    }
  }

  isSelected(card: CattleCard): boolean {
    return this.selectedCards.includes(card);
  }

  confirm() {
    this.perform.emit({
      type: this.selectedAction,
      cattleCards: this.selectedCards,
      // TODO Allow user to select cost preference
      costPreference: CostPreference.CHEAPEST
    });

    this.selectedCards = [];
  }
}
