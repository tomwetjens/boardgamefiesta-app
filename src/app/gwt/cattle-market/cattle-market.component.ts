import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, CattleCard, CattleMarket, PossibleBuy, State} from '../model';
import {TableService} from '../../table.service';
import {AudioService} from '../../audio.service';
import {Table} from '../../shared/model';
import {COW} from "../sounds";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {BuyCattleDialogComponent} from "../buy-cattle-dialog/buy-cattle-dialog.component";
import {fromPromise} from "rxjs/internal-compatibility";

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
      .find(option => option.breedingValue === this.selectedCards[0].breedingValue
        && option.pair === (this.selectedCards.length === 2));
  }

  get buyingCattle(): boolean {
    return this.selectedAction === ActionType.BUY_CATTLE;
  }

  constructor(private tableService: TableService,
              private audioService: AudioService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.cattleMarket) {
      const current = changes.cattleMarket.currentValue as CattleMarket;
      const previous = changes.cattleMarket.previousValue as CattleMarket;

      if (current && previous) {
        if (current.cards.length !== previous.cards.length) {
          this.audioService.playEffect(COW);
        }
      }
    }
  }

  canSelectCard(card: CattleCard) {
    return this.buyingCattle && this.canBuySingle(card.breedingValue);
  }

  selectCard(card: CattleCard) {
    if (!this.canSelectCard(card)) {
      return;
    }

    const index = this.selectedCards.indexOf(card);

    if (index < 0) {
      if (this.selectedCards.length === 2) {
        // Max 2 can be selected. Deselect the first one
        this.selectedCards.splice(0, 1);
      }

      if (this.selectedCards.length > 0
        && (this.selectedCards[0].breedingValue !== card.breedingValue /*Switching breeding values*/
          || !this.canBuyPair(card.breedingValue) /*Pair not possible*/)) {
        // Clear earlier selection
        this.selectedCards = [];
      }

      // Select the card
      this.selectedCards.push(card);
    } else {
      // Toggle selected card
      this.selectedCards.splice(index, 1);
    }
  }

  isSelected(card: CattleCard): boolean {
    return this.selectedCards.includes(card);
  }

  confirm() {
    const options = this.state.possibleBuys
      .filter(option => option.breedingValue === this.selectedCards[0].breedingValue)
      .filter(option => option.pair === (this.selectedCards.length === 2))
      .sort((a, b) => a.cowboys - b.cowboys);

    if (options.length > 1) {
      const ngbModalRef = this.ngbModal.open(BuyCattleDialogComponent);
      const componentInstance = ngbModalRef.componentInstance as BuyCattleDialogComponent;
      componentInstance.cards = this.selectedCards;
      componentInstance.options = options;

      fromPromise(ngbModalRef.result).subscribe(option => {
        this.performAction(option);
      })
    } else {
      this.performAction(options[0]);
    }
  }

  private performAction(option: PossibleBuy) {
    this.perform.emit({
      type: this.selectedAction,
      cattleCards: this.selectedCards,
      cowboys: option.cowboys,
      dollars: option.dollars
    });

    this.selectedCards = [];
  }

  private canBuyPair(breedingValue: number): boolean {
    return !!this.state.possibleBuys.find(option => option.breedingValue === breedingValue && option.pair);
  }

  private canBuySingle(breedingValue: number): boolean {
    return !!this.state.possibleBuys.find(option => option.breedingValue === breedingValue && !option.pair);
  }
}
