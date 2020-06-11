import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface ToastrMessage {
  header?: string;
  type: 'error' | 'info';
  key: string;
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

  error(key: string) {
    this.messages.next({type: 'error', key, delay: 3000, autohide: true});
  }
}
