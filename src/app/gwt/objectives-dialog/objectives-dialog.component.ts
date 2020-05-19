import {Component, Input, OnInit} from '@angular/core';
import {Table} from '../../shared/model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PlayerState} from '../model';

@Component({
  selector: 'app-objectives-dialog',
  templateUrl: './objectives-dialog.component.html',
  styleUrls: ['./objectives-dialog.component.scss']
})
export class ObjectivesDialogComponent implements OnInit {

  @Input() table: Table;
  @Input() playerState: PlayerState;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
