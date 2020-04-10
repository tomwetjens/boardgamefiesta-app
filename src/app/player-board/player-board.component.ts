import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, PlayerState, Unlockable} from '../model';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss']
})
export class PlayerBoardComponent implements OnInit {

  @Input() playerState: PlayerState;
  @Input() actions: ActionType[];
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  get checkboxes(): boolean {
    return this.selectedAction && this.selectedAction.includes('DISCARD_PAIR');
  }

  unlock(type: Unlockable) {
    switch (type) {
      case Unlockable.CERT_LIMIT_4:
        this.action.emit({type: 'UNLOCK_CERT_LIMIT_TO_4'});
        break;
      case Unlockable.CERT_LIMIT_6:
        this.action.emit({type: 'UNLOCK_CERT_LIMIT_TO_6'});
        break;
      case Unlockable.EXTRA_CARD:
        this.action.emit({type: 'UNLOCK_EXTRA_CARD'});
        break;
      case Unlockable.EXTRA_STEP_DOLLARS:
        this.action.emit({type: 'UNLOCK_EXTRA_STEP_DOLLARS'});
        break;
      case Unlockable.EXTRA_STEP_POINTS:
        this.action.emit({type: 'UNLOCK_EXTRA_STEP_POINTS'});
        break;
    }
  }

  performSingle(type: string) {
    if (this.actions.includes('SINGLE_AUX_ACTION')) {
      this.action.emit({type: 'SINGLE_AUX_ACTION'});
    } else if (this.actions.includes('SINGLE_OR_DOUBLE_AUX_ACTION')) {
      this.action.emit({type: 'SINGLE_OR_DOUBLE_AUX_ACTION'});
    }

    switch (type) {
      case Unlockable.AUX_GAIN_DOLLAR:
        this.action.emit({type: 'GAIN_1_DOLLAR'});
        break;
      case Unlockable.AUX_DRAW_CARD_TO_DISCARD_CARD:
        this.action.emit({type: 'DRAW_1_CARD_THEN_DISCARD_1_CARD'});
        break;
      case Unlockable.AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT:
        this.action.emit({type: 'DRAW_1_CARD_THEN_DISCARD_1_CARD'});
        break;
      // TODO
    }
  }

  performDouble(type: string) {
    switch (type) {
      case Unlockable.AUX_GAIN_DOLLAR:
        this.action.emit({type: 'GAIN_2_DOLLARS'});
        break;
      case Unlockable.AUX_DRAW_CARD_TO_DISCARD_CARD:
        this.action.emit({type: 'DRAW_2_CARDS_THEN_DISCARD_2_CARDS'});
        break;
      case Unlockable.AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT:
        this.action.emit({type: 'DRAW_2_CARDS_THEN_DISCARD_2_CARDS'});
        break;
      // TODO
    }
  }

  public canPerform(actionType: ActionType): boolean {
    return this.actions && this.actions.includes(actionType);
  }

  public hasUnlocked(key: string, atLeast: number = 1): boolean {
    return this.playerState && this.playerState.unlocked && this.playerState.unlocked[key] >= atLeast;
  }

  confirm() {
    if (this.selectedAction.startsWith('DISCARD_PAIR')) {
      // TODO CHeck if pair
      this.action.emit({type: this.selectedAction, cards: this.playerState.hand});
    }
  }
}
