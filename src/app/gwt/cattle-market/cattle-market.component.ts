import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, CattleCard, CattleMarket} from '../model';
import {TableService} from '../../table.service';
import {AudioService} from '../../audio.service';
import {Table} from '../../shared/model';

@Component({
  selector: 'app-cattle-market',
  templateUrl: './cattle-market.component.html',
  styleUrls: ['./cattle-market.component.scss']
})
export class CattleMarketComponent implements OnInit, OnChanges {

  // private possibleBuys: PossibleBuy[];

  @Input() table: Table;
  @Input() cattleMarket: CattleMarket;

  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  selectedCards: CattleCard[] = [];

  get canConfirm(): boolean {
    return this.selectedCards.length > 0;
  }

  get canBuy(): boolean {
    return this.selectedAction === ActionType.BUY_CATTLE;
  }

  constructor(private tableService: TableService, private audioService: AudioService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes.selectedAction) {
    //   if (this.selectedAction === ActionType.BUY_CATTLE) {
    //     this.tableService.getPossibleBuys(this.table.id)
    //       .subscribe(possibleBuys => this.possibleBuys = possibleBuys);
    //   } else {
    //     this.possibleBuys = null;
    //   }
    // }

    if (changes.cattleMarket) {
      const current = changes.cattleMarket.currentValue as CattleMarket;
      const previous = changes.cattleMarket.previousValue as CattleMarket;

      if (current && previous) {
        if (current.cards.length !== previous.cards.length) {
          this.audioService.playSound('cow');
        }
      }
    }
  }

  canSelectCard(card: CattleCard) {
    // function containsAllInAnyOrder(arr: number[], elements: number[]) {
    //   const copy = Object.assign([], arr);
    //   for (const e of elements) {
    //     const index = copy.indexOf(e as any);
    //     if (index < 0) {
    //       return false;
    //     }
    //     copy.splice(index, 1);
    //   }
    //   return true;
    // }

    return this.selectedAction === ActionType.BUY_CATTLE;
    // TODO Only allow selecting combinations that are possible
    // && this.possibleBuys
    // && this.possibleBuys.length > 0
    // && this.possibleBuys.some(possibleBuy => containsAllInAnyOrder(possibleBuy.breedingValues,
    //   this.selectedCards.map(selectedCard => selectedCard.breedingValue).concat(card.breedingValue)));
  }

  selectCard(card: CattleCard) {
    const index = this.selectedCards.indexOf(card);

    if (index < 0) {
      if (this.canSelectCard(card)) {
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
    this.perform.emit({type: this.selectedAction, cattleCards: this.selectedCards});
    this.selectedCards = [];
  }
}
