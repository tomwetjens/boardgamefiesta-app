import {Component, Input, OnInit} from '@angular/core';
import {BonusCard} from "../model";

@Component({
  selector: 'big-bazar-bonus-card-popover',
  templateUrl: './bonus-card-popover.component.html',
  styleUrls: ['./bonus-card-popover.component.scss']
})
export class BonusCardPopoverComponent implements OnInit {

  @Input() bonusCard: BonusCard;

  constructor() { }

  ngOnInit(): void {
  }

}
