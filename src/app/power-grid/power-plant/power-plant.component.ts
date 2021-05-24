import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {PowerPlant, ResourceType} from "../model";

@Component({
  selector: 'power-grid-power-plant',
  templateUrl: './power-plant.component.html',
  styleUrls: ['./power-plant.component.scss']
})
export class PowerPlantComponent implements OnInit {

  @Input() powerPlant: PowerPlant;

  icon: string;

  constructor() { }

  ngOnInit(): void {
    this.icon = ''.concat(...this.powerPlant.consumes);
  }

}
