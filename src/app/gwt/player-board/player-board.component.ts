import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, Card, CattleCard, CattleType, PlayerState, State, Worker} from '../model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {PlayerBuildingsComponent} from '../player-buildings/player-buildings.component';
import {AudioService} from '../../audio.service';
import {ObjectivesDialogComponent} from '../objectives-dialog/objectives-dialog.component';
import {Table} from '../../shared/model';
import {CARD, CERTIFICATE, COINS, COWBOY, CRAFTSMAN, ENGINEER} from "../sounds";
import {DiscardPileDialogComponent} from "../discard-pile-dialog/discard-pile-dialog.component";
import {DrawStackDialogComponent} from "../draw-stack-dialog/draw-stack-dialog.component";

@Component({
  selector: 'app-player-board',
  templateUrl: './player-board.component.html',
  styleUrls: ['./player-board.component.scss']
})
export class PlayerBoardComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() state: State;
  @Input() playerState: PlayerState;
  @Input() actions: ActionType[] = [];
  @Input() selectedAction: ActionType;
  @Input() readonly = false;

  @Output() perform = new EventEmitter<Action>();
  @Output() selectAction = new EventEmitter<ActionType>();

  cowboys: Worker[] = [];
  craftsmen: Worker[] = [];
  engineers: Worker[] = [];

  constructor(private ngbModal: NgbModal, private audioService: AudioService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.playerState) {
      this.cowboys = Array(this.playerState.cowboys - 1).fill(Worker.COWBOY);
      this.craftsmen = Array(this.playerState.craftsmen - 1).fill(Worker.CRAFTSMAN);
      this.engineers = Array(this.playerState.engineers - 1).fill(Worker.ENGINEER);

      const current = changes.playerState.currentValue as PlayerState;
      const previous = changes.playerState.previousValue as PlayerState;

      if (current && previous) {
        if (current.balance !== previous.balance) {
          this.audioService.playSound(COINS);
        }

        if ((current.hand !== previous.hand && this.isHandChanged(current.hand, previous.hand))
          // Or in case of other player, where hand is not known
          || current.handSize !== previous.handSize
          // Or when gaining a card
          || current.discardPile.length !== previous.discardPile.length) {
          this.audioService.playSound(CARD);
        }

        if (current.cowboys > previous.cowboys) {
          this.audioService.playSound(COWBOY);
        }
        if (current.craftsmen > previous.craftsmen) {
          this.audioService.playSound(CRAFTSMAN);
        }
        if (current.engineers > previous.engineers) {
          this.audioService.playSound(ENGINEER);
        }

        // TODO Sound for removing disc

        if (current.certificates > previous.certificates) {
          this.audioService.playSound(CERTIFICATE);
        }
      }
    }
  }

  private isHandChanged(current: Card[], previous: Card[]) {
    return current.length !== previous.length ||
      current.some(a => !previous.find(b => JSON.stringify(a) === JSON.stringify(b)));
  }

  clickAuxiliaryAction(actionType: string) {
    if (this.canSelectAction(actionType)) {
      this.selectAction.emit(actionType as ActionType);
    }
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

  selectCard(card: Card) {
    switch (this.selectedAction) {
      case ActionType.DISCARD_CARD:
      case ActionType.REMOVE_CARD:
        this.perform.emit({type: this.selectedAction, card});
        break;

      case ActionType.DISCARD_1_OBJECTIVE_CARD_TO_GAIN_2_CERTIFICATES:
      case ActionType.PLAY_OBJECTIVE_CARD:
        this.perform.emit({type: this.selectedAction, objectiveCard: card});
        break;

      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_3_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND:
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_1_CERTIFICATE:
      case ActionType.DISCARD_PAIR_TO_GAIN_3_DOLLARS:
      case ActionType.DISCARD_PAIR_TO_GAIN_4_DOLLARS:
        this.perform.emit({type: this.selectedAction, cattleType: (card as CattleCard).type});
        break;
    }
  }

  unlock(unlock: string) {
    if ([ActionType.UNLOCK_WHITE, ActionType.UNLOCK_BLACK_OR_WHITE].includes(this.selectedAction)) {
      this.perform.emit({type: this.selectedAction, unlock});
    }
  }

  canSelectCard(card: Card) {
    switch (this.selectedAction) {
      case ActionType.DISCARD_CARD:
      case ActionType.REMOVE_CARD:
        return true;
      case ActionType.DISCARD_1_OBJECTIVE_CARD_TO_GAIN_2_CERTIFICATES:
      case ActionType.PLAY_OBJECTIVE_CARD:
        return this.isObjectiveCard(card);
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_3_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND:
      case ActionType.DISCARD_1_CATTLE_CARD_TO_GAIN_1_CERTIFICATE:
        return this.isCattleCard(card);
      case ActionType.DISCARD_PAIR_TO_GAIN_3_DOLLARS:
      case ActionType.DISCARD_PAIR_TO_GAIN_4_DOLLARS:
        return this.isCattleCard(card) && this.hasPair((card as CattleCard).type);
      default:
        return false;
    }
  }

  private hasPair(cattleType: CattleType) {
    return this.playerState.hand.filter(card => this.isCattleCard(card) && ((card as CattleCard).type === cattleType)).length > 1;
  }

  private isCattleCard(card: Card) {
    return 'breedingValue' in card;
  }

  private isObjectiveCard(card: Card) {
    return !this.isCattleCard(card);
  }

  canSelectAction(actionType: string) {
    return !this.readonly && this.state.actions.includes(actionType as ActionType);
  }

  showBuildings() {
    const ngbModalRef = this.ngbModal.open(PlayerBuildingsComponent);
    const componentInstance = ngbModalRef.componentInstance as PlayerBuildingsComponent;
    componentInstance.table = this.table;
    componentInstance.playerState = this.playerState;
  }

  showObjectives() {
    const ngbModalRef = this.ngbModal.open(ObjectivesDialogComponent);
    const componentInstance = ngbModalRef.componentInstance as ObjectivesDialogComponent;
    componentInstance.table = this.table;
    componentInstance.playerState = this.playerState;
  }

  showDiscardPile() {
    const ngbModalRef = this.ngbModal.open(DiscardPileDialogComponent);
    const componentInstance = ngbModalRef.componentInstance as DiscardPileDialogComponent;
    componentInstance.playerState = this.playerState;
  }

  showDrawStack() {
    const ngbModalRef = this.ngbModal.open(DrawStackDialogComponent);
    const componentInstance = ngbModalRef.componentInstance as DrawStackDialogComponent;
    componentInstance.playerState = this.playerState;
  }

  canSelectCowboy(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.cowboys - 2;
  }

  selectCowboy(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.perform.emit({type: this.selectedAction, worker: Worker.COWBOY});
    }
  }

  canSelectCraftsman(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.craftsmen - 2;
  }

  selectCraftsman(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.perform.emit({type: this.selectedAction, worker: Worker.CRAFTSMAN});
    }
  }

  canSelectEngineer(index: number): boolean {
    return this.selectedAction === ActionType.APPOINT_STATION_MASTER && index === this.playerState.engineers - 2;
  }

  selectEngineer(index: number) {
    if (this.selectedAction === ActionType.APPOINT_STATION_MASTER) {
      this.perform.emit({type: this.selectedAction, worker: Worker.ENGINEER});
    }
  }

}
