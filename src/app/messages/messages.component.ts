import {Component, OnDestroy, OnInit} from '@angular/core';
import {Message, MessageService} from '../message.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

interface ToastMessage {
  message: Message;
  delay: number;
  autohide: boolean;
}

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit, OnDestroy {

  toastMessages: ToastMessage[] = [];

  private destroyed = new Subject();

  constructor(private messageService: MessageService) {
  }

  ngOnInit(): void {
    this.messageService.errors
      .pipe(takeUntil(this.destroyed))
      .subscribe(msg => this.toastMessages.push({
        message: msg,
        delay: 3000,
        autohide: true
      }));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  hide(msg: ToastMessage) {
    const index = this.toastMessages.indexOf(msg);
    this.toastMessages.splice(index, 1);
  }
}
