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

import {Options} from './shared/model';

export interface ChangeOptionsRequest {
  options: Options;
}

export enum ErrorCode {
  NO_SUCH_USER = 'NO_SUCH_USER',
  EXCEEDS_MAX_REALTIME_GAMES = 'EXCEEDS_MAX_REALTIME_GAMES',
  CANNOT_INVITE_YOURSELF = 'CANNOT_INVITE_YOURSELF',
  GAME_ALREADY_STARTED_OR_ENDED = 'GAME_ALREADY_STARTED_OR_ENDED',
  GAME_NOT_STARTED = 'GAME_NOT_STARTED',
  NOT_INVITED = 'NOT_INVITED',
  ALREADY_RESPONDED = 'ALREADY_RESPONDED',
  MUST_BE_OWNER = 'MUST_BE_OWNER',
  NOT_PLAYER_IN_GAME = 'NOT_PLAYER_IN_GAME',
  NOT_YOUR_TURN = 'NOT_YOUR_TURN',
  MUST_SPECIFY_USERNAME_OR_EMAIL = 'MUST_SPECIFY_USERNAME_OR_EMAIL',
  MIN_PLAYERS = 'MIN_PLAYERS',
  EXCEEDS_MAX_PLAYERS = 'EXCEEDS_MAX_PLAYERS',
  GAME_ALREADY_ENDED = 'GAME_ALREADY_ENDED',
  NOT_ACCEPTED = 'NOT_ACCEPTED',
  CANNOT_ABANDON = 'CANNOT_ABANDON',
  GAME_ABANDONED = 'GAME_ABANDONED',
  ALREADY_INVITED = 'ALREADY_INVITED',
  NOT_SUPPORTED = 'NOT_SUPPORTED',
  USERNAME_TOO_SHORT = 'USERNAME_TOO_SHORT',
  USERNAME_TOO_LONG = 'USERNAME_TOO_LONG',
  USERNAME_INVALID_CHARS = 'USERNAME_INVALID_CHARS',
  USERNAME_FORBIDDEN = 'USERNAME_FORBIDDEN',
  EMAIL_ALREADY_IN_USE = 'EMAIL_ALREADY_IN_USE',
  IN_GAME_ERROR = 'IN_GAME_ERROR',
  COMPUTER_NOT_SUPPORTED = 'COMPUTER_NOT_SUPPORTED',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

export interface ErrorResponse {
  errorCode: ErrorCode;
  gameId?: string;
  reasonCode?: string;
}

export interface AddFriendRequest {
  userId: string;
}

export interface Game {
  id: string;
  minNumberOfPlayers: number;
  maxNumberOfPlayers: number;
  computerSupport: boolean;
}
