import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, CattleCard, CattleMarket, Game, PossibleBuy} from '../model';
import {GameService} from '../game.service';

@Component({
  selector: 'app-cattle-market',
  templateUrl: './cattle-market.component.html',
  styleUrls: ['./cattle-market.component.scss']
})
export class CattleMarketComponent implements OnInit, OnChanges {

  private possibleBuys: PossibleBuy[];

  @Input() game: Game;
  @Input() cattleMarket: CattleMarket;

  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  selectedCards: CattleCard[] = [];

  get canConfirm(): boolean {
    return this.selectedCards.length > 0;
  }

  get canBuy():boolean {
    return this.selectedAction === ActionType.BUY_CATTLE;
  }

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedAction) {
      if (this.selectedAction === ActionType.BUY_CATTLE) {
        this.gameService.getPossibleBuys(this.game.id)
          .subscribe(possibleBuys => this.possibleBuys = possibleBuys);
      } else {
        this.possibleBuys = null;
      }
    }
  }

  get cards(): CattleCard[] {
    return this.cattleMarket.cards.sort((a, b) => b.breedingValue - a.breedingValue);
  }

  canSelectCard(card: CattleCard) {
    function containsAllInAnyOrder(arr: number[], elements: number[]) {
      const copy = Object.assign([], arr);
      for (const e of elements) {
        const index = copy.indexOf(e as any);
        if (index < 0) {
          return false;
        }
        copy.splice(index, 1);
      }
      return true;
    }

    return this.selectedAction === ActionType.BUY_CATTLE
      && this.possibleBuys
      && this.possibleBuys.length > 0
      && this.possibleBuys.some(possibleBuy => containsAllInAnyOrder(possibleBuy.breedingValues,
        this.selectedCards.map(selectedCard => selectedCard.breedingValue).concat(card.breedingValue)));
  }

  selectCard(card: CattleCard) {
    console.log('selectCard: ', card);


    if (this.selectedAction === ActionType.BUY_CATTLE) {
      const index = this.selectedCards.indexOf(card);

      if (index < 0) {
        if (this.canSelectCard(card)) {
          this.selectedCards.push(card);
        }
      } else {
        this.selectedCards.splice(index, 1);
      }
    }
  }

  isSelected(card: CattleCard): boolean {
    return this.selectedCards.includes(card);
  }

  confirm() {
    this.action.emit({type: this.selectedAction, cattleCards: this.selectedCards});
    this.selectedCards = [];
  }
}
