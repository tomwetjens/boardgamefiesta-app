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

export type ActionType = string;

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

export type Player = 'YELLOW' | 'RED' | 'BLUE' | 'WHITE';

export interface PlayerState {
  readonly balance: Dollars;
  readonly cowboys: number;
  readonly craftsmen: number;
  readonly engineers: number;
  readonly hand: Card[];
  // TODO
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
  readonly players: Player[];
  readonly stationMaster?: StationMaster;
  readonly worker?: Worker;
}

export interface RailroadTrack {
  readonly players: { [player in Player]: Space };
  readonly stations: Station[];
}

export type LocationType = 'START' | 'BUILDING' | 'HAZARD' | 'TEEPEE' | 'KANSAS_CITY';

export type LocationName = string;

export interface Location {
  readonly name: LocationName;
  readonly type: LocationType;
  readonly next: LocationName[];
}

export interface Trail {
  readonly kansasCity: Location;
  readonly start: Location;
  readonly locations: Location[];
  readonly teepeeLocations: LocationName[];
}

export interface Game {
  readonly player: PlayerState;
  readonly currentPlayer: Player;
  readonly actions: ActionType[];
  readonly cattleMarket: CattleMarket;
  readonly foresights: Foresights;
  readonly jobMarket: JobMarket;
  readonly objectiveCards: ObjectiveCard[];
  readonly otherPlayers: { [player in Player]: PlayerState };
  readonly railroadTrack: RailroadTrack;
  readonly trail: Trail;
}

export interface Action {
  type: ActionType;
  [key: string]: any;
}
