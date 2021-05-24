import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {BonusCard} from "../model";

@Component({
  selector: 'big-bazar-confirm-bonus-card-dialog',
  templateUrl: './confirm-bonus-card-dialog.component.html',
  styleUrls: ['./confirm-bonus-card-dialog.component.scss']
})
export class ConfirmBonusCardDialogComponent implements OnInit {

  @Input() bonusCard: BonusCard;

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
