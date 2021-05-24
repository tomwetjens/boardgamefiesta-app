import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Table} from "../../shared/model";
import {Action, ActionType, PowerGrid, PowerPlant} from "../model";

@Component({
  selector: 'power-grid-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {

  @Input() state: PowerGrid;
  @Input() table: Table;
  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  @Output() selectedActionChange = new EventEmitter<ActionType>();

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.state.actions && this.state.actions.length === 1) {
      this.selectedAction = this.state.actions[0];
    } else {
      this.selectedAction = null;
    }
    this.selectedActionChange.emit(this.selectedAction);
  }

  selectPowerPlant(powerPlant: PowerPlant) {
    if (this.selectedAction === ActionType.START_AUCTION) {
      this.perform.emit({type: ActionType.START_AUCTION, powerPlant: powerPlant.name});
    }
  }
}
