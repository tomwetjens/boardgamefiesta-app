import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'big-bazar-bonus-card-deck',
  templateUrl: './bonus-card-deck.component.html',
  styleUrls: ['./bonus-card-deck.component.scss']
})
export class BonusCardDeckComponent implements OnInit {

  @Input() size: number;

  constructor() { }

  ngOnInit(): void {
  }

}
