import {EventEmitter, InjectionToken, Type} from '@angular/core';
import {Options, Table} from './model';

export interface OptionsComponent {
  table: Table;
  readonly changeOptions: EventEmitter<Options>;
}

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
  optionsComponent?: Type<OptionsComponent>;
}

export const GAME_PROVIDERS: {[key: string]: GameProvider} = {};
