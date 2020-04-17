import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, Card, PlayerState, State} from '../model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PlayerBuildingsComponent} from '../player-buildings/player-buildings.component';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss']
})
export class PlayerBoardComponent implements OnInit {

  @Input() state: State;
  @Input() playerState: PlayerState;
  @Input() actions: ActionType[] = [];
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  selectedCards: Card[] = [];

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  clickAuxiliaryAction(action: string) {
    this.action.emit({type: action as ActionType});
  }

  hasUnlocked(unlockable: string, atLeast: number = 1): boolean {
    return this.playerState && this.playerState.unlocked[unlockable] && this.playerState.unlocked[unlockable] >= atLeast;
  }

  get canUnlockWhite(): boolean {
    return this.selectedAction === ActionType.UNLOCK_WHITE || this.selectedAction === ActionType.UNLOCK_BLACK_OR_WHITE;
  }

  get canUnlockBlack(): boolean {
    return this.selectedAction === ActionType.UNLOCK_BLACK_OR_WHITE;
  }

  clickCard(card: Card) {
    const index = this.selectedCards.indexOf(card);

    if (index < 0) {
      this.selectedCards.push(card);
    } else {
      this.selectedCards.splice(index, 1);
    }

    if (this.selectedAction === 'DISCARD_CARD') {
      this.action.emit({type: this.selectedAction, card});
      this.selectedCards = [];
    }
  }

  unlock(unlock: string) {
    if (this.selectedAction === 'UNLOCK_WHITE' || this.selectedAction === 'UNLOCK_BLACK_OR_WHITE') {
      this.action.emit({type: this.selectedAction, unlock});
    }
  }

  canSelectCard(card: Card) {
    return ['DISCARD_CARD'].includes(this.selectedAction);
  }

  canSelectAction(actionType: string) {
    return this.state.actions.includes(actionType as ActionType);
  }

  showBuildings() {
    const ngbModalRef = this.ngbModal.open(PlayerBuildingsComponent);
    ngbModalRef.componentInstance.playerState = this.playerState;
  }
}
