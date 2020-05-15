import {LogEntry} from "./model";

export interface GameSpecific {

  translate(logEntry: LogEntry): string;

}
