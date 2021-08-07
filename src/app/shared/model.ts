/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
  readonly emailPreferences?: EmailPreferences;
}

export interface EmailPreferences {
  sendInviteEmail: boolean;
  turnBasedPreferences: TurnBasedPreferences;
}

export interface TurnBasedPreferences {
  sendTurnEmail: boolean;
  sendEndedEmail: boolean;
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
  readonly canKickAfterTurnLimit?: boolean;
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
  PRACTICE = 'PRACTICE'
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
  readonly mode: TableMode;
  readonly visibility: Visibility;
  readonly options: Options;
  readonly status: TableStatus;
  readonly canAccept: boolean;
  readonly player?: string;
  readonly otherPlayers: string[];
  readonly players: { [key: string]: TablePlayer };
  readonly numberOfPlayers: number;
  readonly created: string;
  readonly started: string;
  readonly ended: string;
  readonly turn?: boolean;
  readonly currentPlayers?: string[];
  /**
   * @deprecated use currentPlayers instead
   */
  readonly currentPlayer?: string;
  readonly owner: User;
  readonly canStart: boolean;
  readonly canJoin: boolean;
  readonly canLeave: boolean;
  readonly canUndo?: boolean;
  readonly minNumberOfPlayers: number;
  readonly maxNumberOfPlayers: number;
  readonly minNumberOfPlayersGame: number;
  readonly maxNumberOfPlayersGame: number;
  readonly autoStart: boolean;
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
  IN_GAME_EVENT = 'IN_GAME_EVENT',
  LEFT = 'LEFT',
  UNDO = 'UNDO',
  JOIN = 'JOIN',
  BEGIN_TURN = 'BEGIN_TURN',
  END_TURN = 'END_TURN',
  SKIP = 'SKIP',
  END = 'END'
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
