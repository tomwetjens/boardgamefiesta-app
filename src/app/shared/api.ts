import {EventEmitter, Type} from '@angular/core';
import {LogEntry, Options, Table} from './model';

export interface OptionsComponent {
  table: Table;
  readonly changeOptions: EventEmitter<Options>;
}

export interface GameProvider {
  optionsComponent?: Type<OptionsComponent>;

  translate(logEntry: LogEntry, table: Table): string;
}

export const GAME_PROVIDERS: { [key: string]: GameProvider } = {};
