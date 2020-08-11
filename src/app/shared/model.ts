export enum PlayerColor {
  YELLOW = 'YELLOW',
  RED = 'RED',
  BLUE = 'BLUE',
  WHITE = 'WHITE',
  GREEN = 'GREEN'
}

export interface Player {
  readonly name: string;
  readonly color: PlayerColor;
}

export interface Options {
  [key: string]: number | string | boolean;
}

export interface User {
  readonly id: string;
  readonly username: string;
  email: string;
  readonly lastSeen: string;
  readonly avatarUrl: string;
  language: string;
  location?: string;
}

export enum PlayerType {
  USER = 'USER',
  COMPUTER = 'COMPUTER'
}

export enum PlayerStatus {
  INVITED = 'INVITED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED'
}

export interface TablePlayer {
  readonly id: string;
  readonly type: PlayerType;
  readonly user?: User;
  readonly status: PlayerStatus;
  readonly rating?: number;
  readonly turnLimit?: string;
  readonly color?: PlayerColor;
  readonly score?: number;
  readonly winner?: boolean;
}

export enum TableType {
  REALTIME = 'REALTIME'
}

export enum TableMode {
  NORMAL = 'NORMAL',
  TRAINING = 'TRAINING'
}

export enum TableStatus {
  NEW = 'NEW',
  STARTED = 'STARTED',
  ENDED = 'ENDED'
}

export interface Table {
  readonly id: string;
  readonly game: string;
  readonly type: TableType;
  readonly options: Options;
  readonly status: TableStatus;
  readonly accepted: boolean;
  readonly player?: string;
  readonly otherPlayers: string[];
  readonly players: { [key: string]: TablePlayer };
  readonly created: string;
  readonly started: string;
  readonly ended: string;
  readonly turn?: boolean;
  readonly currentPlayer?: string;
  readonly owner: User;
  readonly startable: boolean;
  readonly canUndo?: boolean;
}

export interface CreateTableRequest {
  game: string;
  type: TableType;
  mode: TableMode;
  inviteUserIds?: string[];
  options?: Options;
}

export enum EventType {
  STARTED = 'STARTED',
  ENDED = 'ENDED',
  INVITED = 'INVITED',
  UNINVITED = 'UNINVITED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  STATE_CHANGED = 'STATE_CHANGED',
  LEFT = 'LEFT',
  PROPOSED_TO_LEAVE = 'PROPOSED_TO_LEAVE',
  AGREED_TO_LEAVE = 'AGREED_TO_LEAVE',
  ABANDONED = 'ABANDONED',
  OPTIONS_CHANGED = 'OPTIONS_CHANGED',
  KICKED = 'KICKED',
  COMPUTER_ADDED = 'COMPUTER_ADDED'
}

export interface Event {
  readonly type: EventType;
  readonly tableId?: string;
  readonly userId?: string;
}

export enum LogEntryType {
  ACCEPT = 'ACCEPT',
  REJECT = 'REJECT',
  START = 'START',
  INVITE = 'INVITE',
  UNINVITE = 'UNINVITE',
  KICK = 'KICK',
  PROPOSED_TO_LEAVE = 'PROPOSED_TO_LEAVE',
  AGREED_TO_LEAVE = 'AGREED_TO_LEAVE',
  CREATE = 'CREATE',
  IN_GAME_EVENT = 'IN_GAME_EVENT'
}

export interface LogEntry {
  timestamp: string;
  player?: TablePlayer;
  user?: User;
  type: LogEntryType;
  parameters: string[];
  otherUser?: User;
}
