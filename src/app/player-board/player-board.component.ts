import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, Card, PlayerState, Unlockable} from '../model';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss']
})
export class PlayerBoardComponent implements OnInit {

  @Input() playerState: PlayerState;
  @Input() actions: ActionType[] = [];
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  selectedCards: Card[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  clickAuxiliaryAction(action: ActionType) {
    this.action.emit({type: action});
  }

  hasUnlocked(unlockable: string, atLeast: number = 1): boolean {
    return this.playerState && this.playerState.unlocked[unlockable] && this.playerState.unlocked[unlockable] >= atLeast;
  }

  get canUnlockWhite(): boolean {
    return this.selectedAction === 'UNLOCK_WHITE' || this.selectedAction === 'UNLOCK_BLACK_OR_WHITE';
  }

  get canUnlockBlack(): boolean {
    return this.selectedAction === 'UNLOCK_BLACK_OR_WHITE';
  }

  clickCard(card: Card) {
    const index = this.selectedCards.indexOf(card);

    if (index < 0) {
      this.selectedCards.push(card);
    } else {
      this.selectedCards.splice(index, 1);
    }

    if (this.actions.includes('DISCARD_2_CARDS')) {
      if (this.selectedCards.length === 2) {
        this.action.emit({type: 'DISCARD_2_CARDS', cards: this.selectedCards});
        this.selectedCards = [];
      }
    } else if (this.actions.includes('DISCARD_3_CARDS')) {
      if (this.selectedCards.length === 3) {
        this.action.emit({type: 'DISCARD_3_CARDS', cards: this.selectedCards});
        this.selectedCards = [];
      }
    } else if (this.actions.includes('DISCARD_1_CARD')) {
      if (this.selectedCards.length === 1) {
        this.action.emit({type: 'DISCARD_1_CARD', cards: this.selectedCards});
        this.selectedCards = [];
      }
    }
  }

  unlock(unlock: string) {
    if (this.selectedAction === 'UNLOCK_WHITE' || this.selectedAction === 'UNLOCK_BLACK_OR_WHITE') {
      this.action.emit({type: this.selectedAction, unlock});
    }
  }
}
