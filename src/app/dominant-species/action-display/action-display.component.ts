import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, ActionDisplay, ActionName} from "../model";

@Component({
  selector: 'ds-action-display',
  templateUrl: './action-display.component.html',
  styleUrls: ['./action-display.component.scss']
})
export class ActionDisplayComponent implements OnInit {

  @Input() actionDisplay: ActionDisplay;

  @Input() selectedAction: ActionName;

  @Output() perform = new EventEmitter<Action>();

  constructor() {
  }

  ngOnInit(): void {
  }

  placeActionPawn(actionType: string, index: number) {
    this.perform.emit({
      [ActionName.PlaceActionPawn]: {
        actionType,
        index
      }
    });
  }
}
