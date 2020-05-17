import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, CattleCard, Table, State, PlayerState} from '../model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HandSelectComponent} from '../hand-select/hand-select.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {AudioService} from '../audio.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() state: State;
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();
  @Output() selectAction = new EventEmitter<ActionType>();

  constructor(private audioService: AudioService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      const currentState = changes.state.currentValue as State;
      const previousState = changes.state.previousValue as State;

      if (currentState && previousState) {
        if (currentState.turn && !previousState.turn) {
          this.audioService.playSound('alert');
        }
      }
    }
  }

  perform(action: Action) {
    this.action.emit(action);
  }

  trackPlayerState(index: number, playerState: PlayerState) {
    return playerState.player.name;
  }
}
