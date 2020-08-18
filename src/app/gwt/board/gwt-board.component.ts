import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, PlayerState, State} from '../model';
import {AudioService} from '../../audio.service';
import {Table} from '../../shared/model';
import {MessageDialogComponent} from '../../shared/message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OPENING_MUSIC, SOUNDS} from '../sounds';
import {EndedDialogComponent} from '../ended-dialog/ended-dialog.component';

const AUTO_SELECTED_ACTIONS = [
  ActionType.MOVE,
  ActionType.DISCARD_CARD,
  ActionType.CHOOSE_FORESIGHTS,
  ActionType.CHOOSE_FORESIGHT_1,
  ActionType.CHOOSE_FORESIGHT_2,
  ActionType.CHOOSE_FORESIGHT_3,
  ActionType.DELIVER_TO_CITY,
  ActionType.UNLOCK_WHITE,
  ActionType.UNLOCK_BLACK_OR_WHITE,
  ActionType.DOWNGRADE_STATION
];

const DIRECT_ACTIONS = [
  ActionType.DISCARD_1_DUTCH_BELT_TO_GAIN_2_DOLLARS,
  ActionType.DISCARD_1_DUTCH_BELT_TO_GAIN_3_DOLLARS,
  ActionType.GAIN_2_DOLLARS,
  ActionType.GAIN_1_DOLLAR,
  ActionType.GAIN_1_CERTIFICATE,
  ActionType.DRAW_CARD,
  ActionType.DRAW_2_CARDS,
  ActionType.DRAW_3_CARDS,
  ActionType.DRAW_4_CARDS,
  ActionType.DRAW_5_CARDS,
  ActionType.DRAW_6_CARDS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE,
  ActionType.DISCARD_1_GUERNSEY,
  ActionType.DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS,
  ActionType.SINGLE_AUXILIARY_ACTION,
  ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION,
  ActionType.DISCARD_1_BLACK_ANGUS_TO_GAIN_2_CERTIFICATES,
  ActionType.DISCARD_1_HOLSTEIN_TO_GAIN_10_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE_AND_2_DOLLARS,
  ActionType.DISCARD_1_JERSEY_TO_MOVE_ENGINE_1_FORWARD,
  ActionType.DISCARD_1_GUERNSEY_TO_GAIN_4_DOLLARS,
  ActionType.DRAW_2_CATTLE_CARDS,
  ActionType.GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS,
  ActionType.GAIN_1_DOLLAR_PER_ENGINEER,
  ActionType.GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR,
  ActionType.GAIN_4_DOLLARS,
  ActionType.MAX_CERTIFICATES,
  ActionType.UPGRADE_STATION
];

const FREE_ACTIONS = [
  ActionType.DRAW_CARD,
  ActionType.DRAW_2_CARDS,
  ActionType.DRAW_3_CARDS,
  ActionType.DRAW_4_CARDS,
  ActionType.DRAW_5_CARDS,
  ActionType.DRAW_6_CARDS,
  ActionType.GAIN_1_CERTIFICATE,
  ActionType.GAIN_1_DOLLAR,
  ActionType.GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS,
  ActionType.GAIN_1_DOLLAR_PER_ENGINEER,
  ActionType.GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR,
  ActionType.GAIN_2_DOLLARS,
  ActionType.GAIN_4_DOLLARS,
  ActionType.MAX_CERTIFICATES,
  ActionType.MOVE_1_FORWARD,
  ActionType.MOVE_2_FORWARD,
  ActionType.MOVE_3_FORWARD,
  ActionType.MOVE_3_FORWARD_WITHOUT_FEES,
  ActionType.MOVE_4_FORWARD,
  ActionType.MOVE_5_FORWARD,
  ActionType.MOVE_ENGINE_1_FORWARD,
  ActionType.MOVE_ENGINE_2_OR_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_2_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_4_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS,
  ActionType.REMOVE_HAZARD_FOR_FREE,
  ActionType.SINGLE_AUXILIARY_ACTION,
  ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION,
  ActionType.UPGRADE_ANY_STATION_BEHIND_ENGINE,
  ActionType.UPGRADE_STATION,
  ActionType.USE_ADJACENT_BUILDING
];

@Component({
  selector: 'app-gwt-board',
  templateUrl: './gwt-board.component.html',
  styleUrls: ['./gwt-board.component.scss']
})
export class GwtBoardComponent implements OnInit, OnChanges {

  private endedDialog: NgbModalRef;

  @Input() table: Table;
  @Input() state: State;
  @Input() busy: boolean;

  selectedAction: ActionType;
  @Output() perform = new EventEmitter<Action>();
  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  constructor(private audioService: AudioService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.audioService.preload(SOUNDS);

    if (this.state) {
      this.stateChanged(this.state, undefined);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      const currentState = changes.state.currentValue as State;
      const previousState = changes.state.previousValue as State;

      this.stateChanged(currentState, previousState);
    }
  }

  private stateChanged(currentState: State, previousState: State) {
    if (currentState.player
      && !currentState.trail.playerLocations[currentState.player.player.color]
      && !this.audioService.isPlayingMusic) {
      // Before player did first move
      this.audioService.playMusic(OPENING_MUSIC);
    }

    if (currentState.turn
      && currentState.actions.length === 1
      && AUTO_SELECTED_ACTIONS.includes(currentState.actions[0])) {
      this.selectedAction = currentState.actions[0];
    } else {
      this.selectedAction = null;
    }

    if (currentState.ended) {
      if (!this.endedDialog) {
        this.endedDialog = this.ngbModal.open(EndedDialogComponent);

        const componentInstance = this.endedDialog.componentInstance as EndedDialogComponent;
        componentInstance.table = this.table;
        componentInstance.state = currentState;

        fromPromise(this.endedDialog.result).subscribe({
          error: () => this.endedDialog = null,
          complete: () => this.endedDialog = null
        });
      }
    }
  }

  doEndTurn() {
    if (this.canPerformFreeAction) {
      const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
      const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
      messageDialogComponent.type = 'confirm';
      messageDialogComponent.messageKey = 'gwt.confirmEndTurn';
      messageDialogComponent.confirmKey = 'endTurn';
      messageDialogComponent.cancelKey = 'cancel';
      fromPromise(ngbModalRef.result).subscribe(() => this.endTurn.emit());
    } else {
      this.endTurn.emit();
    }
  }

  trackPlayerState(index: number, playerState: PlayerState) {
    return playerState.player.name;
  }

  get canSkip(): boolean {
    return this.state.turn && this.state.actions && this.state.actions.length > 0;
  }

  get canPerformFreeAction(): boolean {
    return this.state.actions && this.state.actions.some(action => FREE_ACTIONS.includes(action));
  }

  selectAction(actionType: string) {
    if (DIRECT_ACTIONS.includes(actionType as ActionType)) {
      this.perform.emit({type: actionType as ActionType});
    } else {
      this.selectedAction = actionType as ActionType;
    }
  }

}
