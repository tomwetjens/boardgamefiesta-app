import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table} from "../../shared/model";
import {ActionType, PowerGrid} from "../model";

@Component({
  selector: 'power-grid-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  @Input() table: Table;
  @Input() state: PowerGrid;
  @Input() selectedAction: ActionType;

  @Output() selectedActionChange = new EventEmitter<ActionType>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
