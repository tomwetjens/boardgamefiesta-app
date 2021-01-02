import {LogEntry, Table} from './model';

export interface Option {
  key: string;
  values: string[] | boolean[];
  defaultValue: string | boolean;
}

export interface GameProvider {
  getOptions(table: Table): Option[];

  translate(logEntry: LogEntry, table: Table): string;
}

export const GAME_PROVIDERS: { [key: string]: GameProvider } = {};
