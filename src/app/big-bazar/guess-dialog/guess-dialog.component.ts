import { Component, OnInit } from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-guess-dialog',
  templateUrl: './guess-dialog.component.html',
  styleUrls: ['./guess-dialog.component.scss']
})
export class GuessDialogComponent implements OnInit {

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
