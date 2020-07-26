import {Component, Input, OnInit} from '@angular/core';
import {CattleCard, PossibleBuy} from "../model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-buy-cattle-dialog',
  templateUrl: './buy-cattle-dialog.component.html',
  styleUrls: ['./buy-cattle-dialog.component.scss']
})
export class BuyCattleDialogComponent implements OnInit {

  @Input() options: PossibleBuy[];
  @Input() cards: CattleCard[];

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
