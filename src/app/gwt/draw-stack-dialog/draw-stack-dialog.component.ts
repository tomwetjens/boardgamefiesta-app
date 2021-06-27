import {Component, Input, OnInit} from '@angular/core';
import {Card} from "../model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-draw-stack-dialog',
  templateUrl: './draw-stack-dialog.component.html',
  styleUrls: ['./draw-stack-dialog.component.scss']
})
export class DrawStackDialogComponent implements OnInit {

  @Input() drawStack: Card[];

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
