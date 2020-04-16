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
  @Input() selectedAction: ActionType;

  @Output() action = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  perform(action: Action) {
    console.log('perform:', action);
    this.action.emit(action);
  }
}
