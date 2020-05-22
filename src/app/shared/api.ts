import {EventEmitter, InjectionToken, Type} from '@angular/core';
import {Table} from './model';

export interface BoardComponent {
  table: Table;
  state: any;
  readonly perform: EventEmitter<any>;
  readonly skip: EventEmitter<void>;
  readonly endTurn: EventEmitter<void>;
  readonly canSkip: boolean;
}

export interface GameProvider {
  id: string;
  boardComponent: Type<BoardComponent>;
}

export const GAME = new InjectionToken('GAME');
