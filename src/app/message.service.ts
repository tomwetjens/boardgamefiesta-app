import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

export interface Message {
  type: 'error' | 'info';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  errors = new Subject<Message>();

  constructor() {
  }

  error(text: string) {
    this.errors.next({type: 'error', text});
  }
}
