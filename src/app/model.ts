export type Dollars = number;
export type Points = number;

export type CattleType = string;
export type BreedingValue = number;

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
  | 'DISCARD_1_CARD'
  | 'DISCARD_2_CARDS'
  | 'DISCARD_3_CARDS'
  | 'DISCARD_PAIR_TO_GAIN_4_DOLLARS'
  | 'DRAW_2_CARDS_THEN_DISCARD_2_CARDS'
  | 'PAY_1_DOLLAR_TO_MOVE_ENGINE_1_FORWARD'
  | 'DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS'
  | 'REMOVE_2_CARDS'
  | 'DELIVER_TO_CITY'
  | 'SINGLE_AUX_ACTION'
  | 'SINGLE_OR_DOUBLE_AUX_ACTION'
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
  | 'UNLOCK_CERT_LIMIT_TO_4'
  | 'UNLOCK_CERT_LIMIT_TO_6'
  | 'UNLOCK_EXTRA_CARD'
  | 'UNLOCK_EXTRA_STEP_DOLLARS'
  | 'UNLOCK_EXTRA_STEP_POINTS';

export type Teepee = 'BLUE' | 'GREEN';

export type Worker = 'COWBOY' | 'CRAFTSMAN' | 'ENGINEER';

export type HazardType = 'FLOOD' | 'DROUGHT' | 'ROCKFALL';

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
}

export interface ObjectiveCard {
  // TODO
  readonly points: Points;
  readonly penalty: Points;
}

type Card = ObjectiveCard | CattleCard;

export type PlayerColor = 'YELLOW' | 'RED' | 'BLUE' | 'WHITE';

export type Unlockable = 'CERT_LIMIT_6'
  | 'CERT_LIMIT_4'
  | 'EXTRA_STEP_DOLLARS'
  | 'EXTRA_STEP_POINTS'
  | 'EXTRA_CARD'
  | 'AUX_GAIN_DOLLAR'
  | 'AUX_DRAW_CARD_TO_DISCARD_CARD'
  | 'AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT'
  | 'AUX_PAY_TO_MOVE_ENGINE_FORWARD'
  | 'AUX_MOVE_ENGINE_BACKWARDS_TO_REMOVE_CARD';

export interface Player {
  readonly name: string;
  readonly color: PlayerColor;
}

export interface PlayerState {
  readonly player: Player;
  readonly balance: Dollars;
  readonly cowboys: number;
  readonly craftsmen: number;
  readonly engineers: number;
  readonly hand: Card[];
  // TODO

  readonly unlocked: { [key in Unlockable]: number };
}

export interface Space {
  readonly type: 'NORMAL' | 'TURNOUT';
  readonly index: number;
}

export type StationMaster = 'PERM_CERT_POINTS_FOR_EACH_2_CERTS'
  | 'PERM_CERT_POINTS_FOR_EACH_2_HAZARDS'
  | 'PERM_CERT_POINTS_FOR_TEEPEE_PAIRS'
  | 'REMOVE_HAZARD_TEEPEE_POINTS_FOR_EACH_2_OBJECTIVE_CARDS'
  | 'GAIN_2_DOLLARS_POINT_FOR_EACH_WORKER';

export interface Station {
  readonly players: string[];
  readonly stationMaster?: StationMaster;
  readonly worker?: Worker;
}

export interface RailroadTrack {
  readonly players: { [playerName: string]: Space };
  readonly stations: Station[];
}

export type LocationType = 'START' | 'BUILDING' | 'HAZARD' | 'TEEPEE' | 'KANSAS_CITY';

export interface Location {
  readonly name: string;
  readonly type: LocationType;
  readonly next: string[];
}

export interface Trail {
  readonly kansasCity: Location;
  readonly start: Location;
  readonly locations: { [playerName: string]: Location };
  readonly teepeeLocations: Location[];
  readonly playerLocations: { [playerName: string]: string };
}

export interface State {
  readonly player: PlayerState;
  readonly currentPlayer: string;
  readonly actions: ActionType[];
  readonly cattleMarket: CattleMarket;
  readonly foresights: Foresights;
  readonly jobMarket: JobMarket;
  readonly objectiveCards: ObjectiveCard[];
  readonly otherPlayers: { [playerName: string]: PlayerState };
  readonly railroadTrack: RailroadTrack;
  readonly trail: Trail;
}

export interface Game {
  id: string;
  status: 'NEW' | 'STARTED' | 'ENDED';
}

export interface Action {
  type: ActionType;

  [key: string]: any;
}
