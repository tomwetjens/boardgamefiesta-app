import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../shared/model";
import {DominantSpecies} from "../model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'ds-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit {

  @Input() table: Table;
  @Input() state: DominantSpecies;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
