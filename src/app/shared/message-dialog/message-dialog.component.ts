import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-message-dialog',
  templateUrl: './message-dialog.component.html',
  styleUrls: ['./message-dialog.component.scss']
})
export class MessageDialogComponent implements OnInit {

  @Input() type: 'info' | 'confirm' | 'alert' = 'info';
  @Input() titleKey?: string;
  @Input() messageKey: string;

  @Input() confirmKey?: string;
  @Input() cancelKey?: string;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

}
