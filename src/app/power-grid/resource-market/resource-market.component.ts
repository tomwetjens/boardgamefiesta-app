import {Component, Input, OnInit} from '@angular/core';
import {ResourceMarket} from "../model";

@Component({
  selector: 'power-grid-resource-market',
  templateUrl: './resource-market.component.html',
  styleUrls: ['./resource-market.component.scss']
})
export class ResourceMarketComponent implements OnInit {

  @Input() resourceMarket: ResourceMarket;

  constructor() {
  }

  ngOnInit(): void {
  }

}
