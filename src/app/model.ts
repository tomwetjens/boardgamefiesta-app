export type Dollars = number;
export type Points = number;

export type CattleType = string;
export type BreedingValue = number;

export enum DiscColor {
  WHITE,
  BLACK
}

export interface CattleCard {
  readonly breedingValue: BreedingValue;
  readonly points: Points;
  readonly type: CattleType;
}

export interface CattleMarket {
  readonly cards: CattleCard[];
}

export type ActionType = 'CHOOSE_FORESIGHTS'
  | 'MOVE_ENGINE_2_BACKWARDS_TO_REMOVE_2_CARDS'
  | 'PAY_2_TO_MOVE_ENGINE_2_FORWARD'
  | 'DRAW_2_CATTLE_CARDS'
  | 'DRAW_3_CARDS_THEN_DISCARD_3_CARDS'
  | 'GAIN_1_DOLLAR'
  | 'DISCARD_1_DUTCH_BELT'
  | 'DISCARD_CARD'
  | 'DISCARD_PAIR_TO_GAIN_4_DOLLARS'
  | 'DRAW_CARD'
  | 'PAY_1_DOLLAR_TO_MOVE_ENGINE_1_FORWARD'
  | 'DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS'
  | 'REMOVE_2_CARDS'
  | 'DELIVER_TO_CITY'
  | 'SINGLE_AUXILIARY_ACTION'
  | 'SINGLE_OR_DOUBLE_AUXILIARY_ACTION'
  | 'PLACE_BUILDING_FOR_2_DOLLARS_PER_CRAFTSMAN'
  | 'DISCARD_1_GUERNSEY'
  | 'MOVE_ENGINE_2_OR_3_FORWARD'
  | 'REMOVE_HAZARD_FOR_FREE'
  | 'PAY_2_DOLLARS_AND_MOVE_ENGINE_2_BACKWARDS_TO_GAIN_2_CERTS'
  | 'GAIN_OBJECTIVE_CARD'
  | 'UPGRADE_STATION'
  | 'APPOINT_STATION_MASTER'
  | 'PLAY_OBJECTIVE_CARD'
  | 'DISCARD_1_JERSEY_TO_GAIN_2_CERTS'
  | 'REMOVE_HAZARD'
  | 'PAY_1_DOLLAR_AND_MOVE_ENGINE_1_BACKWARDS_TO_GAIN_1_CERT'
  | 'MOVE'
  | 'REMOVE_1_CARD'
  | 'MOVE_ENGINE_1_BACKWARDS_TO_REMOVE_1_CARD'
  | 'HIRE_WORKER_DISCOUNT'
  | 'HIRE_WORKER'
  | 'HIRE_SECOND_WORKER'
  | 'DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS'
  | 'DRAW_1_CARD_THEN_DISCARD_1_CARD'
  | 'GAIN_2_DOLLARS'
  | 'BUY_CATTLE'
  | 'TRADE_WITH_INDIANS'
  | 'DISCARD_1_JERSEY_TO_GAIN_1_CERT'
  | 'DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS'
  | 'MOVE_ENGINE_FORWARD'
  | 'PLACE_BUILDING_FOR_1_DOLLAR_PER_CRAFTSMAN'
  | 'GAIN_1_CERT'
  | 'PAY_2_DOLLARS_TO_MOVE_ENGINE_2_FORWARD'
  | 'UNLOCK_WHITE'
  | 'UNLOCK_BLACK_OR_WHITE';

export type Teepee = 'BLUE' | 'GREEN';

export type Worker = 'COWBOY' | 'CRAFTSMAN' | 'ENGINEER';

export enum HazardType {
  FLOOD = 'FLOOD',
  DROUGHT = 'DROUGHT',
  ROCKFALL = 'ROCKFALL'
}

export type Hands = 'GREEN' | 'BLACK' | 'BOTH';

export interface Hazard {
  readonly type: HazardType;
  readonly points: Points;
  readonly hands: Hands;
}

export interface Tile {
  readonly type: 'TEEPEE' | 'HAZARD' | 'WORKER';
  readonly teepee?: Teepee;
  readonly hazard?: Hazard;
  readonly worker?: Worker;
}

export interface Foresights {
  readonly choices: Tile[][];
}

export interface JobMarketRow {
  readonly cattleMarket: boolean;
  readonly cost: Dollars;
  readonly workers: Worker[];
}

export interface JobMarket {
  readonly rows: JobMarketRow[];
  readonly columns: number;
}

export interface ObjectiveCard {
  // TODO
  readonly points: Points;
  readonly penalty: Points;
}

export type Card = ObjectiveCard | CattleCard;

export enum PlayerColor {
  YELLOW = 'YELLOW',
  RED = 'RED',
  BLUE = 'BLUE',
  WHITE = 'WHITE'
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
  AUX_MOVE_ENGINE_BACKWARDS_TO_REMOVE_CARD = 'AUX_MOVE_ENGINE_BACKWARDS_TO_REMOVE_CARD'
}

export interface Player {
  readonly color: PlayerColor;
  readonly user: User;
}

export interface PlayerState {
  readonly player: Player;
  readonly balance: Dollars;
  readonly cowboys: number;
  readonly craftsmen: number;
  readonly engineers: number;
  readonly certificates: number;
  readonly hand: Card[];
  readonly discardPile: Card[];
  readonly drawStackSize: number;

  readonly unlocked: { [key in Unlockable]: number };
}

export interface Space {
  readonly type: 'NORMAL' | 'TURNOUT';
  readonly index: number;
}

export enum StationMaster {
  PERM_CERT_POINTS_FOR_EACH_2_CERTS = 'PERM_CERT_POINTS_FOR_EACH_2_CERTS',
  PERM_CERT_POINTS_FOR_EACH_2_HAZARDS = 'PERM_CERT_POINTS_FOR_EACH_2_HAZARDS',
  PERM_CERT_POINTS_FOR_TEEPEE_PAIRS = 'PERM_CERT_POINTS_FOR_TEEPEE_PAIRS',
  REMOVE_HAZARD_TEEPEE_POINTS_FOR_EACH_2_OBJECTIVE_CARDS = 'REMOVE_HAZARD_TEEPEE_POINTS_FOR_EACH_2_OBJECTIVE_CARDS',
  GAIN_2_DOLLARS_POINT_FOR_EACH_WORKER = 'GAIN_2_DOLLARS_POINT_FOR_EACH_WORKER'
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
  SAN_FRANCISCO = 'SAN_FRANCISCO'
}

export interface RailroadTrack {
  readonly players: { [color in PlayerColor]: Space };
  readonly cities: { [city in City]: PlayerColor[] };
  readonly stations: Station[];
}

export enum LocationType {
  START = 'START',
  BUILDING = 'BUILDING',
  HAZARD = 'HAZARD',
  TEEPEE = 'TEEPEE',
  KANSAS_CITY = 'KANSAS_CITY'
}

export interface Location {
  readonly name: string;
  readonly type: LocationType;
  readonly next: string[];
  readonly building?: string;
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

export interface State {
  readonly player: PlayerState;
  readonly currentPlayer: Player;
  readonly actions: ActionType[];
  readonly cattleMarket: CattleMarket;
  readonly foresights: Foresights;
  readonly jobMarket: JobMarket;
  readonly objectiveCards: ObjectiveCard[];
  readonly otherPlayers: { [color in PlayerColor]: PlayerState };
  readonly players: { [color in PlayerColor]: Player };
  readonly railroadTrack: RailroadTrack;
  readonly trail: Trail;
  readonly expires: string;
  readonly turn: boolean;
}

export interface User {
  readonly id: string;
  readonly username: string;
}

export interface GamePlayer {
  readonly user: User;
  readonly status: 'INVITED' | 'ACCEPTED' | 'REJECTED';
  readonly color: PlayerColor;
}

export interface Game {
  readonly id: string;
  readonly status: 'NEW' | 'STARTED' | 'ENDED';
  readonly accepted: boolean;
  readonly otherPlayers: GamePlayer[];
  readonly created: string;
  readonly started: string;
  readonly ended: string;
  readonly expires: string;
  readonly turn: boolean;
  readonly currentPlayer: User;
  readonly owner: User;
  readonly startable: boolean;
}

export interface Action {
  type: ActionType;

  [key: string]: any;
}

export interface CreateGameRequest {
  inviteUserIds: string[];
}

export interface PossibleMove {
  cost: number;
  steps: string[];
  playerFees: { player: Player; cost: number }[];
}

export interface PossibleDelivery {
  city: City;
  certificates: number;
  reward: number;
}
