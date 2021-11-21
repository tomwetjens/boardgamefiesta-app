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

import {Player, PlayerColor} from '../shared/model';

export type Dollars = number;
export type Points = number;

export enum CattleType {
  DUTCH_BELT = 'DUTCH_BELT',
  BLACK_ANGUS = 'BLACK_ANGUS',
  GUERNSEY = 'GUERNSEY',
  JERSEY = 'JERSEY',
  HOLSTEIN = 'HOLSTEIN',
  BROWN_SWISS = 'BROWN_SWISS',
  AYRSHIRE = 'AYRSHIRE',
  WEST_HIGHLAND = 'WEST_HIGHLAND',
  TEXAS_LONGHORN = 'TEXAS_LONGHORN',
  SIMMENTAL = 'SIMMENTAL'
}

export type BreedingValue = number;

export enum DiscColor {
  WHITE = 'WHITE',
  BLACK = 'BLACK'
}

export interface CattleCard {
  readonly breedingValue: BreedingValue;
  readonly points: Points;
  readonly type: CattleType;
}

export interface CattleMarket {
  readonly cards: CattleCard[];
  readonly drawStackSize: number;
  readonly drawStack?: CattleCard[];
}

export enum ActionType {
  APPOINT_STATION_MASTER = 'APPOINT_STATION_MASTER',
  PLACE_BID = 'PLACE_BID',
  BUY_CATTLE = 'BUY_CATTLE',
  DELIVER_TO_CITY = 'DELIVER_TO_CITY',
  DISCARD_1_BLACK_ANGUS_TO_GAIN_2_CERTIFICATES = 'DISCARD_1_BLACK_ANGUS_TO_GAIN_2_CERTIFICATES',
  DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS = 'DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS',
  DISCARD_CARD = 'DISCARD_CARD',
  DISCARD_1_CATTLE_CARD_TO_GAIN_3_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND = 'DISCARD_1_CATTLE_CARD_TO_GAIN_3_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND',
  DISCARD_1_CATTLE_CARD_TO_GAIN_6_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND = 'DISCARD_1_CATTLE_CARD_TO_GAIN_6_DOLLARS_AND_ADD_1_OBJECTIVE_CARD_TO_HAND',
  ADD_1_OBJECTIVE_CARD_TO_HAND = 'ADD_1_OBJECTIVE_CARD_TO_HAND',
  DISCARD_1_CATTLE_CARD_TO_GAIN_1_CERTIFICATE = 'DISCARD_1_CATTLE_CARD_TO_GAIN_1_CERTIFICATE',
  DISCARD_CATTLE_CARD_TO_GAIN_7_DOLLARS = 'DISCARD_CATTLE_CARD_TO_GAIN_7_DOLLARS',
  DISCARD_1_DUTCH_BELT_TO_GAIN_2_DOLLARS = 'DISCARD_1_DUTCH_BELT_TO_GAIN_2_DOLLARS',
  DISCARD_1_DUTCH_BELT_TO_GAIN_3_DOLLARS = 'DISCARD_1_DUTCH_BELT_TO_GAIN_3_DOLLARS',
  DISCARD_1_DUTCH_BELT_TO_MOVE_ENGINE_2_FORWARD = 'DISCARD_1_DUTCH_BELT_TO_MOVE_ENGINE_2_FORWARD',
  DISCARD_1_GUERNSEY = 'DISCARD_1_GUERNSEY',
  DISCARD_1_HOLSTEIN_TO_GAIN_10_DOLLARS = 'DISCARD_1_HOLSTEIN_TO_GAIN_10_DOLLARS',
  DISCARD_1_JERSEY_FOR_SINGLE_AUXILIARY_ACTION = 'DISCARD_1_JERSEY_FOR_SINGLE_AUXILIARY_ACTION',
  DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE = 'DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE',
  DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE_AND_2_DOLLARS = 'DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE_AND_2_DOLLARS',
  DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES = 'DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES',
  DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS = 'DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS',
  DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS = 'DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS',
  DISCARD_1_JERSEY_TO_MOVE_ENGINE_1_FORWARD = 'DISCARD_1_JERSEY_TO_MOVE_ENGINE_1_FORWARD',
  DISCARD_1_OBJECTIVE_CARD_TO_GAIN_2_CERTIFICATES = 'DISCARD_1_OBJECTIVE_CARD_TO_GAIN_2_CERTIFICATES',
  DISCARD_1_GUERNSEY_TO_GAIN_4_DOLLARS = 'DISCARD_1_GUERNSEY_TO_GAIN_4_DOLLARS',
  DISCARD_PAIR_TO_GAIN_3_DOLLARS = 'DISCARD_PAIR_TO_GAIN_3_DOLLARS',
  DISCARD_PAIR_TO_GAIN_4_DOLLARS = 'DISCARD_PAIR_TO_GAIN_4_DOLLARS',
  DRAW_CARD = 'DRAW_CARD',
  DRAW_2_CARDS = 'DRAW_2_CARDS',
  DRAW_3_CARDS = 'DRAW_3_CARDS',
  DRAW_4_CARDS = 'DRAW_4_CARDS',
  DRAW_5_CARDS = 'DRAW_5_CARDS',
  DRAW_6_CARDS = 'DRAW_6_CARDS',
  DRAW_2_CATTLE_CARDS = 'DRAW_2_CATTLE_CARDS',
  EXTRAORDINARY_DELIVERY = 'EXTRAORDINARY_DELIVERY',
  GAIN_1_CERTIFICATE = 'GAIN_1_CERTIFICATE',
  GAIN_1_DOLLAR = 'GAIN_1_DOLLAR',
  GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS = 'GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS',
  GAIN_2_DOLLARS_PER_STATION = 'GAIN_2_DOLLARS_PER_STATION',
  GAIN_1_DOLLAR_PER_ENGINEER = 'GAIN_1_DOLLAR_PER_ENGINEER',
  GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR = 'GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR',
  GAIN_2_DOLLARS = 'GAIN_2_DOLLARS',
  GAIN_4_DOLLARS = 'GAIN_4_DOLLARS',
  GAIN_12_DOLLARS = 'GAIN_12_DOLLARS',
  HIRE_WORKER_MINUS_2 = 'HIRE_WORKER_MINUS_2',
  HIRE_WORKER_MINUS_1 = 'HIRE_WORKER_MINUS_1',
  HIRE_WORKER_PLUS_2 = 'HIRE_WORKER_PLUS_2',
  HIRE_WORKER = 'HIRE_WORKER',
  MAX_CERTIFICATES = 'MAX_CERTIFICATES',
  MOVE = 'MOVE',
  MOVE_1_FORWARD = 'MOVE_1_FORWARD',
  MOVE_2_FORWARD = 'MOVE_2_FORWARD',
  MOVE_3_FORWARD = 'MOVE_3_FORWARD',
  MOVE_3_FORWARD_WITHOUT_FEES = 'MOVE_3_FORWARD_WITHOUT_FEES',
  MOVE_4_FORWARD = 'MOVE_4_FORWARD',
  MOVE_5_FORWARD = 'MOVE_5_FORWARD',
  MOVE_ENGINE_1_FORWARD = 'MOVE_ENGINE_1_FORWARD',
  MOVE_ENGINE_2_FORWARD = 'MOVE_ENGINE_2_FORWARD',
  MOVE_ENGINE_1_BACKWARDS_TO_GAIN_3_DOLLARS = 'MOVE_ENGINE_1_BACKWARDS_TO_GAIN_3_DOLLARS',
  MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD = 'MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD',
  MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD_AND_GAIN_1_DOLLAR = 'MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD_AND_GAIN_1_DOLLAR',
  MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS = 'MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS',
  MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS_AND_GAIN_2_DOLLARS = 'MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS_AND_GAIN_2_DOLLARS',
  MOVE_ENGINE_2_OR_3_FORWARD = 'MOVE_ENGINE_2_OR_3_FORWARD',
  MOVE_ENGINE_AT_LEAST_1_BACKWARDS_AND_GAIN_3_DOLLARS = 'MOVE_ENGINE_AT_LEAST_1_BACKWARDS_AND_GAIN_3_DOLLARS',
  MOVE_ENGINE_AT_MOST_2_FORWARD = 'MOVE_ENGINE_AT_MOST_2_FORWARD',
  MOVE_ENGINE_AT_MOST_3_FORWARD = 'MOVE_ENGINE_AT_MOST_3_FORWARD',
  MOVE_ENGINE_AT_MOST_4_FORWARD = 'MOVE_ENGINE_AT_MOST_4_FORWARD',
  MOVE_ENGINE_FORWARD = 'MOVE_ENGINE_FORWARD',
  MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS = 'MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS',
  MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_HAZARDS = 'MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_HAZARDS',
  PAY_1_DOLLAR_AND_MOVE_ENGINE_1_BACKWARDS_TO_GAIN_1_CERTIFICATE = 'PAY_1_DOLLAR_AND_MOVE_ENGINE_1_BACKWARDS_TO_GAIN_1_CERTIFICATE',
  PAY_1_DOLLAR_TO_MOVE_ENGINE_1_FORWARD = 'PAY_1_DOLLAR_TO_MOVE_ENGINE_1_FORWARD',
  PAY_2_DOLLARS_AND_MOVE_ENGINE_2_BACKWARDS_TO_GAIN_2_CERTIFICATES = 'PAY_2_DOLLARS_AND_MOVE_ENGINE_2_BACKWARDS_TO_GAIN_2_CERTIFICATES',
  PAY_2_DOLLARS_TO_MOVE_ENGINE_2_FORWARD = 'PAY_2_DOLLARS_TO_MOVE_ENGINE_2_FORWARD',
  PLACE_BUILDING = 'PLACE_BUILDING',
  PLACE_CHEAP_BUILDING = 'PLACE_CHEAP_BUILDING',
  PLAY_OBJECTIVE_CARD = 'PLAY_OBJECTIVE_CARD',
  REMOVE_CARD = 'REMOVE_CARD',
  REMOVE_HAZARD = 'REMOVE_HAZARD',
  REMOVE_HAZARD_FOR_2_DOLLARS = 'REMOVE_HAZARD_FOR_2_DOLLARS',
  REMOVE_HAZARD_FOR_5_DOLLARS = 'REMOVE_HAZARD_FOR_5_DOLLARS',
  REMOVE_HAZARD_FOR_FREE = 'REMOVE_HAZARD_FOR_FREE',
  SINGLE_AUXILIARY_ACTION = 'SINGLE_AUXILIARY_ACTION',
  SINGLE_OR_DOUBLE_AUXILIARY_ACTION = 'SINGLE_OR_DOUBLE_AUXILIARY_ACTION',
  TAKE_OBJECTIVE_CARD = 'TAKE_OBJECTIVE_CARD',
  TRADE_WITH_TRIBES = 'TRADE_WITH_TRIBES',
  UPGRADE_ANY_STATION_BEHIND_ENGINE = 'UPGRADE_ANY_STATION_BEHIND_ENGINE',
  UPGRADE_STATION = 'UPGRADE_STATION',
  USE_ADJACENT_BUILDING = 'USE_ADJACENT_BUILDING',
  CHOOSE_FORESIGHT_1 = 'CHOOSE_FORESIGHT_1',
  CHOOSE_FORESIGHT_2 = 'CHOOSE_FORESIGHT_2',
  CHOOSE_FORESIGHT_3 = 'CHOOSE_FORESIGHT_3',
  UNLOCK_BLACK_OR_WHITE = 'UNLOCK_BLACK_OR_WHITE',
  UNLOCK_WHITE = 'UNLOCK_WHITE',
  DOWNGRADE_STATION = 'DOWNGRADE_STATION',
  GAIN_EXCHANGE_TOKEN = 'GAIN_EXCHANGE_TOKEN',
  GAIN_1_DOLLAR_PER_CRAFTSMAN = 'GAIN_1_DOLLAR_PER_CRAFTSMAN',
  GAIN_1_CERTIFICATE_AND_1_DOLLAR_PER_BELL = 'GAIN_1_CERTIFICATE_AND_1_DOLLAR_PER_BELL',
  GAIN_2_CERTIFICATES = 'GAIN_2_CERTIFICATES',
  GAIN_3_DOLLARS = 'GAIN_3_DOLLARS',
  DISCARD_CATTLE_CARD_TO_PLACE_BRANCHLET = 'DISCARD_CATTLE_CARD_TO_PLACE_BRANCHLET',
  PLACE_BRANCHLET = 'PLACE_BRANCHLET',
  UPGRADE_STATION_TOWN = 'UPGRADE_STATION_TOWN',
  GAIN_5_DOLLARS = 'GAIN_5_DOLLARS',
  PLACE_BUILDING_FOR_FREE = 'PLACE_BUILDING_FOR_FREE',
  TAKE_BREEDING_VALUE_3_CATTLE_CARD = 'TAKE_BREEDING_VALUE_3_CATTLE_CARD',
  USE_EXCHANGE_TOKEN = 'USE_EXCHANGE_TOKEN',
  TAKE_BONUS_STATION_MASTER = 'TAKE_BONUS_STATION_MASTER',
  UPGRADE_SIMMENTAL = 'UPGRADE_SIMMENTAL'
}

export enum Teepee {
  BLUE = 'BLUE',
  GREEN = 'GREEN'
}

export enum Worker {
  COWBOY = 'COWBOY',
  CRAFTSMAN = 'CRAFTSMAN',
  ENGINEER = 'ENGINEER'
}

export enum HazardType {
  FLOOD = 'FLOOD',
  DROUGHT = 'DROUGHT',
  ROCKFALL = 'ROCKFALL'
}

export enum Hands {
  GREEN = 'GREEN',
  BLACK = 'BLACK',
  BOTH = 'BOTH'
}

export interface Hazard {
  readonly type: HazardType;
  readonly points: Points;
  readonly hands: Hands;
}

export interface Tile {
  readonly teepee?: Teepee;
  readonly hazard?: Hazard;
  readonly worker?: Worker;
}

export interface Foresights {
  readonly choices: Tile[][];
}

export interface JobMarketRow {
  readonly cost: Dollars;
  readonly workers: Worker[];
}

export interface JobMarket {
  readonly rows: JobMarketRow[];
  readonly rowLimit: number;
  readonly currentRowIndex: number;
}

export enum Task {
  BUILDING = 'BUILDING',
  GREEN_TEEPEE = 'GREEN_TEEPEE',
  BLUE_TEEPEE = 'BLUE_TEEPEE',
  HAZARD = 'HAZARD',
  STATION = 'STATION',
  BREEDING_VALUE_3 = 'BREEDING_VALUE_3',
  BREEDING_VALUE_4 = 'BREEDING_VALUE_4',
  BREEDING_VALUE_5 = 'BREEDING_VALUE_5',
  SAN_FRANCISCO = 'SAN_FRANCISCO'
}

export interface Objective {
  readonly objectiveCard: ObjectiveCard;
  readonly score: number;
  readonly committed: boolean;
}

export interface ObjectiveCard {
  readonly tasks: Task[];
  readonly points: Points;
  readonly penalty: Points;
  readonly action: ActionType;
}

export type Card = ObjectiveCard | CattleCard;

export function isObjectiveCard(card: Card): card is ObjectiveCard {
  return 'tasks' in card;
}

export function isCattleCard(card: Card): card is CattleCard {
  return 'breedingValue' in card;
}

export enum Unlockable {
  CERT_LIMIT_6 = 'CERT_LIMIT_6',
  CERT_LIMIT_4 = 'CERT_LIMIT_4',
  EXTRA_STEP_DOLLARS = 'EXTRA_STEP_DOLLARS',
  EXTRA_STEP_POINTS = 'EXTRA_STEP_POINTS',
  EXTRA_CARD = 'EXTRA_CARD',
  AUX_GAIN_DOLLAR = 'AUX_GAIN_DOLLAR',
  AUX_DRAW_CARD_TO_DISCARD_CARD = 'AUX_DRAW_CARD_TO_DISCARD_CARD',
  AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT = 'AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT',
  AUX_PAY_TO_MOVE_ENGINE_FORWARD = 'AUX_PAY_TO_MOVE_ENGINE_FORWARD',
  AUX_MOVE_ENGINE_BACKWARDS_TO_REMOVE_CARD = 'AUX_MOVE_ENGINE_BACKWARDS_TO_REMOVE_CARD',
  AUX_DISCARD_CATTLE_CARD_TO_PLACE_BRANCHLET = 'AUX_DISCARD_CATTLE_CARD_TO_PLACE_BRANCHLET'
}

export enum ScoreCategory {
  BID = 'BID',
  DOLLARS = 'DOLLARS',
  CATTLE_CARDS = 'CATTLE_CARDS',
  OBJECTIVE_CARDS = 'OBJECTIVE_CARDS',
  STATION_MASTERS = 'STATION_MASTERS',
  WORKERS = 'WORKERS',
  HAZARDS = 'HAZARDS',
  EXTRA_STEP_POINTS = 'EXTRA_STEP_POINTS',
  JOB_MARKET_TOKEN = 'JOB_MARKET_TOKEN',
  BUILDINGS = 'BUILDINGS',
  CITIES = 'CITIES',
  STATIONS = 'STATIONS'
}

export interface Score {
  categories: { [key in ScoreCategory]: number };
  total: number;
}

export interface PlayerState {
  readonly player: Player;
  readonly balance: Dollars;
  readonly cowboys: number;
  readonly cowboysRemaining?: number;
  readonly craftsmen: number;
  readonly engineers: number;
  readonly certificates: number;
  readonly tempCertificates: number;
  readonly handValue: number;
  readonly hand: Card[];
  readonly discardPile?: Card[];
  readonly discardPileSize: number;
  readonly discardPileTop: Card;
  readonly drawStackSize: number;
  readonly drawStack?: Card[];
  readonly handSize: number;
  readonly unlocked: { [key in Unlockable]: number };
  readonly buildings: string[];
  readonly stationMasters: StationMaster[];
  readonly hazards: Hazard[];
  readonly teepees: Teepee[];
  readonly objectives: Objective[];
  readonly score?: Score;
  readonly exchangeTokens?: number;
  readonly branchlets?: number;
  readonly automaState?: AutomaState;
  readonly stats?: { [key: string]: any };
}

export interface AutomaState {
  specialization: Worker;
}

export const TURNOUTS = [4, 7, 10, 13, 16, 21, 25, 29, 33];

export type Space = string;

export enum StationMaster {
  PERM_CERT_POINTS_FOR_EACH_2_CERTS = 'PERM_CERT_POINTS_FOR_EACH_2_CERTS',
  PERM_CERT_POINTS_FOR_EACH_2_HAZARDS = 'PERM_CERT_POINTS_FOR_EACH_2_HAZARDS',
  PERM_CERT_POINTS_FOR_TEEPEE_PAIRS = 'PERM_CERT_POINTS_FOR_TEEPEE_PAIRS',
  REMOVE_HAZARD_OR_TEEPEE_POINTS_FOR_EACH_2_OBJECTIVE_CARDS = 'REMOVE_HAZARD_OR_TEEPEE_POINTS_FOR_EACH_2_OBJECTIVE_CARDS',
  GAIN_2_DOLLARS_POINT_FOR_EACH_WORKER = 'GAIN_2_DOLLARS_POINT_FOR_EACH_WORKER',
  TWO_PERM_CERTS = 'TWO_PERM_CERTS',
  TWELVE_DOLLARS = 'TWELVE_DOLLARS',
  PERM_CERT_POINTS_PER_2_STATIONS = 'PERM_CERT_POINTS_PER_2_STATIONS',
  GAIN_2_CERTS_POINTS_PER_BUILDING = 'GAIN_2_CERTS_POINTS_PER_BUILDING',
  PLACE_BRANCHLET_POINTS_PER_2_EXCHANGE_TOKENS = 'PLACE_BRANCHLET_POINTS_PER_2_EXCHANGE_TOKENS',
  GAIN_EXCHANGE_TOKEN_POINTS_PER_AREA = 'GAIN_EXCHANGE_TOKEN_POINTS_PER_AREA'
}

export interface Station {
  readonly players: PlayerColor[];
  readonly stationMaster?: StationMaster;
  readonly worker?: Worker;
}

export enum City {
  KANSAS_CITY = 'KANSAS_CITY',
  TOPEKA = 'TOPEKA',
  WICHITA = 'WICHITA',
  COLORADO_SPRINGS = 'COLORADO_SPRINGS',
  SANTA_FE = 'SANTA_FE',
  ALBUQUERQUE = 'ALBUQUERQUE',
  EL_PASO = 'EL_PASO',
  SAN_DIEGO = 'SAN_DIEGO',
  SACRAMENTO = 'SACRAMENTO',
  SAN_FRANCISCO = 'SAN_FRANCISCO',

  // Second edition:
  // KANSAS_CITY,
  FULTON = 'FULTON',
  // ST_LOUIS,
  BLOOMINGTON = 'BLOOMINGTON',
  PEORIA = 'PEORIA',
  CHICAGO_2 = 'CHICAGO_2',
  TOLEDO = 'TOLEDO',
  PITTSBURGH_2 = 'PITTSBURGH_2',
  PHILADELPHIA = 'PHILADELPHIA',
  // NEW_YORK_CITY,

  // Rttn expansion:
  COLUMBIA = 'COLUMBIA',
  ST_LOUIS = 'ST_LOUIS',
  CHICAGO = 'CHICAGO',
  DETROIT = 'DETROIT',
  CLEVELAND = 'CLEVELAND',
  PITTSBURGH = 'PITTSBURGH',
  NEW_YORK_CITY = 'NEW_YORK_CITY',
  MEMPHIS = 'MEMPHIS',
  DENVER = 'DENVER',
  MILWAUKEE = 'MILWAUKEE',
  GREEN_BAY = 'GREEN_BAY',
  MINNEAPOLIS = 'MINNEAPOLIS',
  TORONTO = 'TORONTO',
  MONTREAL = 'MONTREAL'
}

export type CityStrip = City[];

export const ORIGINAL_CITY_STRIP: CityStrip = [
  City.KANSAS_CITY,
  City.TOPEKA,
  City.WICHITA,
  City.COLORADO_SPRINGS,
  City.SANTA_FE,
  City.ALBUQUERQUE,
  City.EL_PASO,
  City.SAN_DIEGO,
  City.SACRAMENTO,
  City.SAN_FRANCISCO
];

export const SECOND_EDITION_CITY_STRIP: CityStrip = [
  City.KANSAS_CITY,
  City.FULTON,
  City.ST_LOUIS,
  City.BLOOMINGTON,
  City.PEORIA,
  City.CHICAGO_2,
  City.TOLEDO,
  City.PITTSBURGH_2,
  City.PHILADELPHIA,
  City.NEW_YORK_CITY
];

export const RTTN_CITY_STRIP: CityStrip = [
  City.KANSAS_CITY,
  City.COLUMBIA,
  City.ST_LOUIS,
  City.CHICAGO,
  City.DETROIT,
  City.CLEVELAND,
  City.PITTSBURGH,
  City.NEW_YORK_CITY
];

export interface RailroadTrack {
  readonly players: { [color in PlayerColor]: Space };
  readonly cities: { [city in City]: PlayerColor[] };
  readonly stations: Station[];
  readonly towns?: { [name: string]: Town };
  readonly bonusStationMasters?: StationMaster[];
}

export interface Town {
  branchlets: PlayerColor[];
  mediumTownTile?: MediumTownTile;
}

export enum MediumTownTile {
  GAIN_5_DOLLARS_OR_TAKE_CATTLE_CARD = 'GAIN_5_DOLLARS_OR_TAKE_CATTLE_CARD',
  HIRE_WORKER_PLUS_2 = 'HIRE_WORKER_PLUS_2',
  REMOVE_2_CARDS = 'REMOVE_2_CARDS',
  MOVE_ENGINE_3_FORWARD = 'MOVE_ENGINE_3_FORWARD',
  PLACE_BUILDING_FOR_FREE = 'PLACE_BUILDING_FOR_FREE'
}

export enum LocationType {
  START = 'START',
  BUILDING = 'BUILDING',
  HAZARD = 'HAZARD',
  TEEPEE = 'TEEPEE',
  KANSAS_CITY = 'KANSAS_CITY'
}

export interface Building {
  name: string;
  player?: Player;
}

export interface Location {
  readonly name: string;
  readonly type: LocationType;
  readonly next: string[];
  readonly building?: Building;
  readonly teepee?: Teepee;
  readonly reward?: number;
  readonly hazard?: Hazard;
}

export interface Trail {
  readonly kansasCity: Location;
  readonly start: Location;
  readonly locations: { [name: string]: Location };
  readonly teepeeLocations: { [name: string]: Location };
  readonly playerLocations: { [color in PlayerColor]: string };
}

export interface ObjectiveCards {
  readonly available: ObjectiveCard[];
  readonly drawStackSize: number;
}

export enum Status {
  BIDDING = 'BIDDING',
  STARTED = 'STARTED',
  ENDED = 'ENDED'
}

export interface Bid {
  player: string;
  position?: number;
  points?: number;
}

export interface State {
  readonly status: Status;
  readonly railsToTheNorth: boolean;
  readonly startingObjectiveCards: ObjectiveCard[];
  readonly bids: Bid[];
  readonly player?: PlayerState;
  readonly currentPlayer: Player;
  readonly actions: ActionType[];
  readonly cattleMarket: CattleMarket;
  readonly foresights: Foresights;
  readonly jobMarket: JobMarket;
  readonly objectiveCards: ObjectiveCards;
  readonly otherPlayers: PlayerState[];
  readonly railroadTrack: RailroadTrack;
  readonly trail: Trail;
  readonly turn: boolean;
  readonly ended: boolean;
  readonly possibleMoves?: PossibleMove[];
  readonly possibleBuys?: PossibleBuy[];
  readonly possibleDeliveries?: PossibleDelivery[];
  readonly possibleSpaces?: { [actionType in ActionType]: Space[] };
  readonly possibleTowns?: { [actionType in ActionType]: string[] };
}

export interface Action {
  type: ActionType;

  [key: string]: any;
}

export interface PossibleMove {
  to: string;
  cost: number;
  steps: string[];
  route: string[];
  playerFees: { player: Player; fee: number }[];
}

export interface PossibleDelivery {
  city: City;
  certificates: number;
  reward: number;
}

export interface PossibleBuy {
  dollars: number;
  cowboys: number;
  breedingValue: number;
  pair: boolean;
}

export enum GWTEventType {
  SKIP = 'SKIP',
  BEGIN_TURN = 'BEGIN_TURN',
  END_TURN = 'END_TURN',
  ACTION = 'ACTION',
  PAY_FEE_PLAYER = 'PAY_FEE_PLAYER',
  PAY_FEE_BANK = 'PAY_FEE_BANK',
  MAY_APPOINT_STATION_MASTER = 'MAY_APPOINT_STATION_MASTER',
  MUST_TAKE_OBJECTIVE_CARD = 'MUST_TAKE_OBJECTIVE_CARD',
  MAY_REMOVE_BLACK_DISC_INSTEAD_OF_WHITE = 'MAY_REMOVE_BLACK_DISC_INSTEAD_OF_WHITE',
  MUST_REMOVE_DISC_FROM_STATION = 'MUST_REMOVE_DISC_FROM_STATION',
  MAY_REMOVE_HAZARD_FOR_FREE = 'MAY_REMOVE_HAZARD_FOR_FREE',
  MAY_TRADE_WITH_TRIBES = 'MAY_TRADE_WITH_TRIBES',
  MAY_PLACE_CHEAP_BUILDING = 'MAY_PLACE_CHEAP_BUILDING',
  MAY_DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE = 'MAY_DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE',
  MAY_DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS = 'MAY_DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS',
  MAY_HIRE_CHEAP_WORKER = 'MAY_HIRE_CHEAP_WORKER',
  MAY_DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES = 'MAY_DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES',
  MAY_DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS = 'MAY_DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS',
  GAINS_JOB_MARKET_TOKEN = 'GAINS_JOB_MARKET_TOKEN',
  EVERY_OTHER_PLAYER_HAS_1_TURN = 'EVERY_OTHER_PLAYER_HAS_1_TURN',
  ENDS_GAME = 'ENDS_GAME',
  FILL_UP_CATTLE_MARKET = 'FILL_UP_CATTLE_MARKET'
}

export enum Buildings {
  BEGINNER = 'BEGINNER',
  RANDOMIZED = 'RANDOMIZED'
}

export enum PlayerOrder {
  BIDDING = 'BIDDING',
  RANDOMIZED = 'RANDOMIZED'
}

export enum Mode {
  ORIGINAL = 'ORIGINAL',
  STRATEGIC = 'STRATEGIC'
}

export enum Variant {
  ORIGINAL = 'ORIGINAL',
  BALANCED = 'BALANCED'
}

export interface Options {
  mode: Mode;
  buildings: Buildings;
  playerOrder: PlayerOrder;
  variant: Variant;
  stationMasterPromos: boolean;
  building11: boolean;
  building13: boolean;
}

export enum Difficulty {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD',
  VERY_HARD = 'VERY_HARD'
}
