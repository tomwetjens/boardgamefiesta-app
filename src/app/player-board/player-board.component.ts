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

  @Output() action = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  unlock(type: Unlockable) {
    switch(type) {
      case 'CERT_LIMIT_4':
        this.action.emit({ type: 'UNLOCK_CERT_LIMIT_TO_4' });
        break;
      case 'CERT_LIMIT_6':
        this.action.emit({ type: 'UNLOCK_CERT_LIMIT_TO_6' });
        break;
      case 'EXTRA_CARD':
        this.action.emit({ type: 'UNLOCK_EXTRA_CARD' });
        break;
      case 'EXTRA_STEP_DOLLARS':
        this.action.emit({ type: 'UNLOCK_EXTRA_STEP_DOLLARS' });
        break;
      case 'EXTRA_STEP_POINTS':
        this.action.emit({ type: 'UNLOCK_EXTRA_STEP_POINTS' });
        break;
    }
  }

  performSingle(type: Unlockable) {
    if(this.actions.includes('SINGLE_AUX_ACTION')) {
      this.action.emit({ type: 'SINGLE_AUX_ACTION' });
    } else if(this.actions.includes('SINGLE_OR_DOUBLE_AUX_ACTION')) {
      this.action.emit({ type: 'SINGLE_OR_DOUBLE_AUX_ACTION' });
    }

    switch(type) {
      case 'AUX_GAIN_DOLLAR':
        this.action.emit({ type: 'GAIN_1_DOLLAR' });
        break;
      case 'AUX_DRAW_CARD_TO_DISCARD_CARD':
        this.action.emit({ type: 'DRAW_1_CARD_THEN_DISCARD_1_CARD' });
        break;
      case 'AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT':
        this.action.emit({ type: 'DRAW_1_CARD_THEN_DISCARD_1_CARD' });
        break;
      // TODO
    }
  }

  performDouble(type: Unlockable) {
    switch(type) {
      case 'AUX_GAIN_DOLLAR':
        this.action.emit({ type: 'GAIN_2_DOLLARS' });
        break;
      case 'AUX_DRAW_CARD_TO_DISCARD_CARD':
        this.action.emit({ type: 'DRAW_2_CARDS_THEN_DISCARD_2_CARDS' });
        break;
      case 'AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT':
        this.action.emit({ type: 'DRAW_2_CARDS_THEN_DISCARD_2_CARDS' });
        break;
      // TODO
    }
  }

  public canPerform(actionType: ActionType): boolean {
    return this.actions && this.actions.includes(actionType);
  }

  public hasUnlocked(key: Unlockable, atLeast: number = 1): boolean {
    return this.playerState && this.playerState.unlocked && this.playerState.unlocked[key] >= atLeast;
  }

}
