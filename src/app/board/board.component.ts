import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, State} from '../model';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {

  @Input() state: State;

  @Output() action = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  get turn(): boolean {
    return this.state.currentPlayer === this.state.player.player.name;
  }

}
