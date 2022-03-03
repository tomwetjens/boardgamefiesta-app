import {Component, Input, OnInit} from '@angular/core';
import {Animal, AnimalType} from "../model";
import {Player} from "../../shared/model";

@Component({
  selector: 'ds-initiative-marker',
  templateUrl: './initiative-marker.component.html',
  styleUrls: ['./initiative-marker.component.scss']
})
export class InitiativeMarkerComponent implements OnInit {

  @Input() animalType: AnimalType;
  @Input() player?: Player;

  constructor() {
  }

  ngOnInit(): void {
  }

}
