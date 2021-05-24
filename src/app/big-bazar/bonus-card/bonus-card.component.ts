import {Component, Input, OnInit} from '@angular/core';
import {BonusCard} from "../model";

@Component({
  selector: 'big-bazar-bonus-card',
  templateUrl: './bonus-card.component.html',
  styleUrls: ['./bonus-card.component.scss']
})
export class BonusCardComponent implements OnInit {

  @Input() bonusCard?: BonusCard;

  constructor() {
  }

  ngOnInit(): void {
  }

}
