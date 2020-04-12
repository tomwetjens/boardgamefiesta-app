import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface ToastrMessage {
  header: string;
  type: 'error' | 'info';
  text: string;
  delay: number;
  autohide: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  messages = new Subject<ToastrMessage>();

  constructor() {
  }

  error(text: string) {
    this.messages.next({type: 'error', header: 'Error', text, delay: 3000, autohide: true});
  }
}
