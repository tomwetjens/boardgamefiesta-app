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

import {PlayerColor} from '../shared/model';

export enum Action {
  BUY_RUBY = 'BUY_RUBY',
  BONUS_CARD_BUY_RUBY = 'BONUS_CARD_BUY_RUBY',
  BUY_WHEELBARROW_EXTENSION = 'BUY_WHEELBARROW_EXTENSION',
  CATCH_FAMILY_MEMBER_FOR_3_LIRA = 'CATCH_FAMILY_MEMBER_FOR_3_LIRA',
  CATCH_FAMILY_MEMBER_FOR_BONUS_CARD = 'CATCH_FAMILY_MEMBER_FOR_BONUS_CARD',
  DELIVER_TO_SULTAN = 'DELIVER_TO_SULTAN',
  BONUS_CARD_DELIVER_TO_SULTAN = 'BONUS_CARD_DELIVER_TO_SULTAN',
  DISCARD_BONUS_CARD = 'DISCARD_BONUS_CARD',
  GOVERNOR = 'GOVERNOR',
  GUESS_AND_ROLL_FOR_LIRA = 'GUESS_AND_ROLL_FOR_LIRA',
  LEAVE_ASSISTANT = 'LEAVE_ASSISTANT',
  MAX_FABRIC = 'MAX_FABRIC',
  MAX_FRUIT = 'MAX_FRUIT',
  MAX_SPICE = 'MAX_SPICE',
  MOVE = 'MOVE',
  MOVE_SMUGGLER = 'MOVE_SMUGGLER',
  PAY_1_FABRIC = 'PAY_1_FABRIC',
  PAY_1_FRUIT = 'PAY_1_FRUIT',
  PAY_1_SPICE = 'PAY_1_SPICE',
  PAY_1_BLUE = 'PAY_1_BLUE',
  PAY_2_LIRA = 'PAY_2_LIRA',
  PAY_2_LIRA_FOR_1_ADDITIONAL_GOOD = 'PAY_2_LIRA_FOR_1_ADDITIONAL_GOOD',
  PAY_2_LIRA_TO_RETURN_ASSISTANT = 'PAY_2_LIRA_TO_RETURN_ASSISTANT',
  PAY_OTHER_MERCHANTS = 'PAY_OTHER_MERCHANTS',
  RETURN_ALL_ASSISTANTS = 'RETURN_ALL_ASSISTANTS',
  ROLL_FOR_BLUE_GOODS = 'ROLL_FOR_BLUE_GOODS',
  SELL_GOODS = 'SELL_GOODS',
  SEND_FAMILY_MEMBER = 'SEND_FAMILY_MEMBER',
  SMUGGLER = 'SMUGGLER',
  TAKE_1_FABRIC = 'TAKE_1_FABRIC',
  TAKE_1_FRUIT = 'TAKE_1_FRUIT',
  TAKE_1_SPICE = 'TAKE_1_SPICE',
  TAKE_1_BLUE = 'TAKE_1_BLUE',
  TAKE_BONUS_CARD_CARAVANSARY = 'TAKE_BONUS_CARD_CARAVANSARY',
  BONUS_CARD_TAKE_5_LIRA = 'BONUS_CARD_TAKE_5_LIRA',
  TAKE_MOSQUE_TILE = 'TAKE_MOSQUE_TILE',
  USE_POST_OFFICE = 'USE_POST_OFFICE',
  BONUS_CARD_USE_POST_OFFICE = 'BONUS_CARD_USE_POST_OFFICE',
  BONUS_CARD_GAIN_1_GOOD = 'BONUS_CARD_GAIN_1_GOOD',
  TAKE_3_LIRA = 'TAKE_3_LIRA',
  TAKE_BONUS_CARD = 'TAKE_BONUS_CARD',
  PLACE_MEMBER_ON_POLICE_STATION = 'PLACE_MEMBER_ON_POLICE_STATION',
  RETURN_1_ASSISTANT = 'RETURN_1_ASSISTANT',
}

export enum BonusCard {
  FAMILY_MEMBER_TO_POLICE_STATION = 'FAMILY_MEMBER_TO_POLICE_STATION',
  GAIN_1_GOOD = 'GAIN_1_GOOD',
  GEMSTONE_DEALER_2X = 'GEMSTONE_DEALER_2X',
  MOVE_0 = 'MOVE_0',
  MOVE_3_OR_4 = 'MOVE_3_OR_4',
  POST_OFFICE_2X = 'POST_OFFICE_2X',
  RETURN_1_ASSISTANT = 'RETURN_1_ASSISTANT',
  SMALL_MARKET_ANY_GOOD = 'SMALL_MARKET_ANY_GOOD',
  SULTAN_2X = 'SULTAN_2X',
  TAKE_5_LIRA = 'TAKE_5_LIRA'
}

export enum GoodsType {
  BLUE = 'BLUE',
  FABRIC = 'FABRIC',
  FRUIT = 'FRUIT',
  SPICE = 'SPICE'
}

export enum MosqueTile {
  EXTRA_ASSISTANT = 'EXTRA_ASSISTANT',
  PAY_2_LIRA_FOR_1_ADDITIONAL_GOOD = 'PAY_2_LIRA_FOR_1_ADDITIONAL_GOOD',
  PAY_2_LIRA_TO_RETURN_ASSISTANT = 'PAY_2_LIRA_TO_RETURN_ASSISTANT',
  TURN_OR_REROLL_DICE = 'TURN_OR_REROLL_DICE'
}

interface PlayerStats {
  assistantsLeft: number;
  assistantsPickedUp: number;
  caughtFamilyMembers: number;
  distanceMoved: number;
  goodsGained: { [goodsType in GoodsType]: number };
  governorUses: number;
  liraGained: number;
  liraPaidToOtherMerchants: number;
  placedFamilyMembers: number;
  placeUses: { [place: number]: number };
  playedBonusCards: { [bonusCard in BonusCard]: number };
  smugglerUses: number;
  turns: number;
}

export interface PlayerState {
  readonly name: string;
  readonly startPlayer: boolean;
  readonly bonusCards?: BonusCard[];
  readonly numberOfBonusCards: number;
  readonly rubies: number;
  readonly lira: number;
  readonly capacity: number;
  readonly goods: { [goodsType in GoodsType]: number };
  readonly mosqueTiles: MosqueTile[];
  readonly stats?: PlayerStats;
}

export interface Merchant {
  readonly assistants: number;
  readonly color: PlayerColor;
}

export interface Place {
  readonly number: number;
  readonly merchants?: Merchant[];
  readonly familyMembers?: PlayerColor[];
  readonly assistants?: { [color in PlayerColor]: number };
  readonly governor?: boolean;
  readonly smuggler?: boolean;
}

export interface Market extends Place {
  readonly demand: GoodsType[];
}

export interface Caravansary extends Place {
  readonly discardPile: BonusCard[];
}

export interface PostOffice extends Place {
  readonly indicators: boolean[];
}

export interface BigBazar {
  readonly layout: Place[][];
  readonly actions: Action[];
  readonly turn: boolean;
  readonly players: { [color in PlayerColor]: PlayerState };
  readonly bonusCards: number;
  readonly maxRubies: number;
}

export enum LayoutType {
  IN_ORDER = 'IN_ORDER',
  LONG_PATHS = 'LONG_PATHS',
  RANDOM = 'RANDOM',
  SHORT_PATHS = 'SHORT_PATHS'
}
