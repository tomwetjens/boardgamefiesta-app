import {LogEntry, Table} from './model';

export interface Option {
  values: string[];
  defaultValue: string;
}

export interface Options {
  [key: string]: Option;
}

export interface GameProvider {
  options: Options;

  translate(logEntry: LogEntry, table: Table): string;
}

export const GAME_PROVIDERS: { [key: string]: GameProvider } = {};
