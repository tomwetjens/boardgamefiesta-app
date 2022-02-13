import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ActionName} from "../model";

@Component({
  selector: 'ds-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.scss']
})
export class ActionBarComponent implements OnInit {

  @Input() actions: ActionName[];

  @Input() selectedAction: ActionName;

  @Output() selectedActionChange = new EventEmitter<ActionName>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
