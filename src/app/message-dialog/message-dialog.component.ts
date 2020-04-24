import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() confirm?: string;
  @Input() cancel?: string;

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
