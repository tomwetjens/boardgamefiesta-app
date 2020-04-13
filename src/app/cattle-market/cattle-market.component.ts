import {Component, Input, OnInit} from '@angular/core';
import {CattleCard, CattleMarket} from '../model';

@Component({
  selector: 'app-cattle-market',
  templateUrl: './cattle-market.component.html',
  styleUrls: ['./cattle-market.component.scss']
})
export class CattleMarketComponent implements OnInit {

  @Input() cattleMarket: CattleMarket;

  constructor() {
  }

  ngOnInit(): void {
  }

  get cards(): CattleCard[] {
    return this.cattleMarket.cards.sort((a, b) => b.breedingValue - a.breedingValue);
  }
}
