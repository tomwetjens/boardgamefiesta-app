import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table, TablePlayer} from "../../shared/model";
import {Action, ActionType, PlayerState, PowerPlantState} from "../model";

@Component({
  selector: 'power-grid-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() table: Table;
  @Input() player: TablePlayer;
  @Input() playerState: PlayerState;
  @Input() selectedAction?: ActionType;

  @Output() perform = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  canSelectPowerPlant(powerPlantState: PowerPlantState): boolean {
    return this.selectedAction === ActionType.REMOVE_POWER_PLANT;
  }

  selectPowerPlant(powerPlantState: PowerPlantState) {
    if (!this.canSelectPowerPlant(powerPlantState)) {
      return;
    }

    switch (this.selectedAction) {
      case ActionType.REMOVE_POWER_PLANT:
        this.perform.emit({type: this.selectedAction, powerPlant: powerPlantState.powerPlant.name});
        break;
    }
  }
}
