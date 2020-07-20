import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {TablePlayer, User} from "./shared/model";

export interface ToastrMessage {
  header?: string;
  type: 'error' | 'info';
  key: string;
  parameters?: any;
  delay: number;
  autohide: boolean;
  player?: TablePlayer;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class ToastrService {

  messages = new Subject<ToastrMessage>();

  constructor() {
  }

  error(key: string, parameters?: any) {
    this.messages.next({type: 'error', key, parameters, delay: 3000, autohide: true});
  }

  inGameEvent(key: string, parameters: any, player: TablePlayer, user?: User) {
    this.messages.next({
      type: 'info',
      key,
      parameters,
      delay: 2000,
      autohide: true,
      player,
      user
    });
  }
}
