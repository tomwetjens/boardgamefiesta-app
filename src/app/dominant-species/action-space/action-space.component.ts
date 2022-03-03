import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Animal, AnimalType} from "../model";
import {TablePlayer} from "../../shared/model";

@Component({
  selector: 'ds-action-space',
  templateUrl: './action-space.component.html',
  styleUrls: ['./action-space.component.scss']
})
export class ActionSpaceComponent implements OnInit {

  @Input() selectable: boolean;
  @Input() animal?: Animal;
  @Input() player?: TablePlayer;

  @Output() selectActionSpace = new EventEmitter<void>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
