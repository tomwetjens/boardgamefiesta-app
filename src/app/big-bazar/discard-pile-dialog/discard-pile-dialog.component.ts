import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {BonusCard} from "../model";

@Component({
  selector: 'big-bazar-discard-pile-dialog',
  templateUrl: './discard-pile-dialog.component.html',
  styleUrls: ['./discard-pile-dialog.component.scss']
})
export class DiscardPileDialogComponent implements OnInit {

  @Input() discardPile: BonusCard[];
  reverseDiscardPile: BonusCard[];

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.reverseDiscardPile = this.discardPile.slice().reverse();
  }

}
