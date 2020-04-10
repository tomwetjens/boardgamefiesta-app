import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, CattleCard, Game, State} from '../model';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {HandSelectComponent} from '../hand-select/hand-select.component';
import {fromPromise} from 'rxjs/internal-compatibility';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() game: Game;
  @Input() state: State;

  @Output() action = new EventEmitter<Action>();

  selectedAction: ActionType;

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  chooseAction(actionType: ActionType) {
    switch (actionType) {
      case 'DISCARD_PAIR_TO_GAIN_4_DOLLARS':
        const modalRef = this.ngbModal.open(HandSelectComponent);
        modalRef.componentInstance.hand = this.state.player.hand;
        modalRef.componentInstance.mode = 'DISCARD';
        modalRef.componentInstance.pair = true;
        fromPromise(modalRef.result)
          .subscribe(cards => this.action.emit({
            type: actionType,
            cattleType: (cards[0] as CattleCard).type
          }), err => this.selectedAction = null);
        break;

      default:
        // Assume no further selection necessary for these actions
        this.action.emit({type: actionType});
        break;
    }
  }
}
