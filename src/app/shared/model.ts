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
  readonly timeZone: string;
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
  REALTIME = 'REALTIME',
  TURN_BASED = 'TURN_BASED'
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

export enum Visibility {
  PUBLIC = 'PUBLIC',
  PRIVATE = 'PRIVATE'
}

export interface Table {
  readonly id: string;
  readonly game: string;
  readonly type: TableType;
  readonly visibility: Visibility;
  readonly options: Options;
  readonly status: TableStatus;
  readonly canAccept: boolean;
  readonly player?: string;
  readonly otherPlayers: string[];
  readonly players: { [key: string]: TablePlayer };
  readonly created: string;
  readonly started: string;
  readonly ended: string;
  readonly turn?: boolean;
  readonly currentPlayer?: string;
  readonly owner: User;
  readonly canStart: boolean;
  readonly canJoin: boolean;
  readonly canLeave: boolean;
  readonly canUndo?: boolean;
  readonly minNumberOfPlayers: number;
  readonly maxNumberOfPlayers: number;
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
  JOINED = 'JOINED',
  LEFT = 'LEFT',
  PROPOSED_TO_LEAVE = 'PROPOSED_TO_LEAVE',
  AGREED_TO_LEAVE = 'AGREED_TO_LEAVE',
  ABANDONED = 'ABANDONED',
  OPTIONS_CHANGED = 'OPTIONS_CHANGED',
  KICKED = 'KICKED',
  COMPUTER_ADDED = 'COMPUTER_ADDED',
  ADDED_AS_FRIEND = 'ADDED_AS_FRIEND'
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
  player?: {
    id: string;
  };
  user?: {
    id: string
    username: string;
  };
  type: LogEntryType;
  parameters: string[];
  otherUser?: {
    id: string;
    username: string;
  }
}
