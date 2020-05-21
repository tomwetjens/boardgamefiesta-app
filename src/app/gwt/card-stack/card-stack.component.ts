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
        return this.cards;
    }

}
