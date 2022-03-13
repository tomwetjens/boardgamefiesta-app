import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Card} from "../model";

@Component({
  selector: 'ds-cards-display',
  templateUrl: './cards-display.component.html',
  styleUrls: ['./cards-display.component.scss']
})
export class CardsDisplayComponent implements OnInit {

  @Input() cards: Card[];
  @Input() deckSize: number;
  @Input() selectable: boolean;
  @Output() selectCard = new EventEmitter<Card>();

  constructor() {
  }

  ngOnInit(): void {
  }

}
