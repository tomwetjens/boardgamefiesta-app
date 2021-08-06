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
