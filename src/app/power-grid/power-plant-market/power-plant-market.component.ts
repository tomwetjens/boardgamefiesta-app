import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {PowerPlant, PowerPlantMarket} from "../model";

@Component({
  selector: 'power-grid-power-plant-market',
  templateUrl: './power-plant-market.component.html',
  styleUrls: ['./power-plant-market.component.scss']
})
export class PowerPlantMarketComponent implements OnInit {

  @Input() powerPlantMarket: PowerPlantMarket;
  @Input() selectable: boolean;

  @Output() selectPowerPlant = new EventEmitter<PowerPlant>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
