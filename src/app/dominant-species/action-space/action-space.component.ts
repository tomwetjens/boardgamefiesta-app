import {Component, Input, OnInit} from '@angular/core';
import {AnimalType} from "../model";

@Component({
  selector: 'ds-action-space',
  templateUrl: './action-space.component.html',
  styleUrls: ['./action-space.component.scss']
})
export class ActionSpaceComponent implements OnInit {

  @Input() actionPawn?: AnimalType;

  constructor() {
  }

  ngOnInit(): void {
  }

}
