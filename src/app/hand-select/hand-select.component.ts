import {Component, Input, OnInit} from '@angular/core';
import {Card, CattleCard} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-hand-select',
  templateUrl: './hand-select.component.html',
  styleUrls: ['./hand-select.component.scss']
})
export class HandSelectComponent implements OnInit {

  @Input() hand: Card[];
  @Input() mode: 'DISCARD' | 'REMOVE';
  @Input() atLeast: number;
  @Input() atMost: number;
  @Input() pair: boolean;

  selected: Card[] = [];

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

  isSelected(card: Card): boolean {
    return this.selected.includes(card);
  }

  clickCard(card: Card) {
    if (this.isSelected(card)) {
      const index = this.selected.indexOf(card);
      this.selected.splice(index, 1);
    } else {
      this.selected.push(card);
    }
  }

  get valid(): boolean {
    if (this.pair) {
      return this.selected.length === 2 && (this.selected[0] as CattleCard).type === (this.selected[1] as CattleCard).type;
    }
  }
}
