import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionType, State, StationMaster} from "../model";

@Component({
  selector: 'gwt-bonus-station-masters',
  templateUrl: './bonus-station-masters.component.html',
  styleUrls: ['./bonus-station-masters.component.scss']
})
export class BonusStationMastersComponent implements OnInit {

  @Input() state: State;
  @Input() selectedAction: ActionType;

  @Output() perform = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  canSelect(stationMaster: StationMaster) {
    return this.selectedAction === ActionType.TAKE_BONUS_STATION_MASTER;
  }

  selectStationMaster(stationMaster: StationMaster) {
    this.perform.emit({type: ActionType.TAKE_BONUS_STATION_MASTER, stationMaster});
  }
}
