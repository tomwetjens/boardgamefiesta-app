export interface PowerGrid {
  map: string;
  areas: Area[];
  playerOrder: string[];
  step: number;
  round: number;
  cities: { [city in City]: string[] };
  powerPlantMarket: PowerPlantMarket;
  resourceMarket: ResourceMarket;
  actions?: ActionType[];
  auction?: Auction;
  playerStates: { [playerId: string]: PlayerState };
}

export interface PlayerState {
  balance: number;
  powerPlants: PowerPlantState[];
}

export interface PowerPlantState {
  powerPlant: PowerPlant;
  // TODO
}

export interface Auction {
  powerPlant: PowerPlant;
  bid?: number;
}

export enum ActionType {
  START_AUCTION = 'START_AUCTION',
  PLACE_BID = 'PLACE_BID',
  REMOVE_POWER_PLANT = 'REMOVE_POWER_PLANT',
  BUY_RESOURCE = 'BUY_RESOURCE',
  CONNECT_CITY = 'CONNECT_CITY',
  PRODUCE_POWER = 'PRODUCE_POWER'
}

export interface PowerPlantMarket {
  actual: PowerPlant[];
  future: PowerPlant[];
  deckSize: number;
}

export interface ResourceMarket {
  available: { [resourceType in ResourceType]: number };
}

export interface PowerPlant {
  name: string;
  cost: number;
  requires: number;
  consumes: ResourceType[];
  powers: number;
}

export enum ResourceType {
  COAL = 'COAL',
  OIL = 'OIL',
  BIO_MASS = 'BIO_MASS',
  URANIUM = 'URANIUM'
}

export type Area = string;

export type City = string;

export interface Action {
  type: ActionType;

  [key: string]: any;
}
