import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, Card, CattleCard, CattleType, PlayerState, State, Worker} from '../model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PlayerBuildingsComponent} from '../player-buildings/player-buildings.component';

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss']
})
export class PlayerBoardComponent implements OnInit, OnChanges {

  @Input() state: State;
  @Input() playerState: PlayerState;
  @Input() actions: ActionType[] = [];
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  selectedCards: Card[] = [];
  cowboys: Worker[] = [];
  craftsmen: Worker[] = [];
  engineers: Worker[] = [];

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.playerState) {
      this.cowboys = Array(this.playerState.cowboys - 1).fill(Worker.COWBOY);
      this.craftsmen = Array(this.playerState.craftsmen - 1).fill(Worker.CRAFTSMAN);
      this.engineers = Array(this.playerState.engineers - 1).fill(Worker.ENGINEER);
    }
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

    switch (this.selectedAction) {
      case ActionType.DISCARD_CARD:
        this.action.emit({type: this.selectedAction, card});
        this.selectedCards = [];
        break;

      case ActionType.DISCARD_PAIR_TO_GAIN_3_DOLLARS:
      case ActionType.DISCARD_PAIR_TO_GAIN_4_DOLLARS:
        this.action.emit({type: this.selectedAction, cattleType: (card as CattleCard).type});
        this.selectedCards = [];
    }
  }

  unlock(unlock: string) {
    if (this.selectedAction === 'UNLOCK_WHITE' || this.selectedAction === 'UNLOCK_BLACK_OR_WHITE') {
      this.action.emit({type: this.selectedAction, unlock});
    }
  }

  canSelectCard(card: Card) {
    return ['DISCARD_CARD'].includes(this.selectedAction)
      || ['DISCARD_PAIR_TO_GAIN_3_DOLLARS', 'DISCARD_PAIR_TO_GAIN_4_DOLLARS'].includes(this.selectedAction) && this.isCattleCard(card) && this.hasPair((card as CattleCard).type);
  }

  private hasPair(cattleType: CattleType) {
    return this.playerState.hand.filter(card => this.isCattleCard(card) && ((card as CattleCard).type === cattleType)).length > 1;
  }

  private isCattleCard(card: Card) {
    return 'breedingValue' in card;
  }

  canSelectAction(actionType: string) {
    return this.state.actions.includes(actionType as ActionType);
  }

  showBuildings() {
    const ngbModalRef = this.ngbModal.open(PlayerBuildingsComponent);
    ngbModalRef.componentInstance.playerState = this.playerState;
  }

  canSelectCowboy(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.cowboys - 2;
  }

  selectCowboy(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.action.emit({type: this.selectedAction, worker: Worker.COWBOY});
    }
  }

  canSelectCraftsman(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.craftsmen - 2;
  }

  selectCraftsman(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.action.emit({type: this.selectedAction, worker: Worker.CRAFTSMAN});
    }
  }

  canSelectEngineer(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.engineers - 2;
  }

  selectEngineer(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.action.emit({type: this.selectedAction, worker: Worker.ENGINEER});
    }
  }

}
