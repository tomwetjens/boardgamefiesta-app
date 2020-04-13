import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Card, CattleCard, ObjectiveCard} from '../model';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit {

  @Input() card: Card;

  constructor() {
  }

  ngOnInit(): void {
  }

  get type(): 'CATTLE' | 'OBJECTIVE' {
    return this.card ? ('breedingValue' in this.card ? 'CATTLE' : 'OBJECTIVE') : null;
  }

  get cattleCard(): CattleCard {
    return this.card as CattleCard;
  }

  get objectiveCard(): ObjectiveCard {
    return this.card as ObjectiveCard;
  }

  @HostBinding('class')
  get className(): string {
    return this.type ? (this.type === 'CATTLE' ? this.cattleCard.type : 'OBJECTIVE') : 'back';
  }

}
