import {Component, Input, OnInit} from '@angular/core';
import {PlayerState} from '../model';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-discard-pile-dialog',
  templateUrl: './discard-pile-dialog.component.html',
  styleUrls: ['./discard-pile-dialog.component.scss']
})
export class DiscardPileDialogComponent implements OnInit {

  @Input() playerState: PlayerState;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
