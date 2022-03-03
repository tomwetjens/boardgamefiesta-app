import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../model";

@Component({
  selector: 'ds-cards-display',
  templateUrl: './cards-display.component.html',
  styleUrls: ['./cards-display.component.scss']
})
export class CardsDisplayComponent implements OnInit {

  @Input() cards: Card[];

  constructor() {
  }

  ngOnInit(): void {
  }

}
