import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, CattleCard, CattleMarket, Game, ObjectiveCard} from '../model';

@Component({
  selector: 'app-objective-cards',
  templateUrl: './objective-cards.component.html',
  styleUrls: ['./objective-cards.component.scss']
})
export class ObjectiveCardsComponent implements OnInit {


  @Input() objectiveCards: ObjectiveCard[];

  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  canSelectCard(card: ObjectiveCard) {
    return this.selectedAction === ActionType.TAKE_OBJECTIVE_CARD;
  }

  selectCard(card: ObjectiveCard) {
    if (this.selectedAction === ActionType.TAKE_OBJECTIVE_CARD && this.canSelectCard(card)) {
      this.action.emit({type: this.selectedAction, objectiveCard: card});
    }
  }
}
