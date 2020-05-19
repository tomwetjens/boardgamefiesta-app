import {Component, Input, OnInit} from '@angular/core';
import {Card} from '../model';

@Component({
  selector: 'app-card-stack',
  templateUrl: './card-stack.component.html',
  styleUrls: ['./card-stack.component.scss']
})
export class CardStackComponent implements OnInit {

  @Input() cards: Card[];
  @Input() size: number;
  @Input() emptyType: 'CATTLE' | 'OBJECTIVE';

  constructor() {
  }

  ngOnInit(): void {
  }

  get stack(): Card[] {
    if (this.cards) {
      return this.cards;
    }
    return Array(Math.min(5, Math.max(1, this.size))).fill(null);
  }

}
