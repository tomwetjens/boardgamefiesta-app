import {AxialCoordinates} from "./hexagon";
import {Player} from "../shared/model";

export interface Action { [actionName: string]: object }

export type Hex = AxialCoordinates;

export enum TileType {
  JUNGLE = 'JUNGLE',
  SAVANNAH = 'SAVANNAH',
  SEA = 'SEA',
  WETLAND = 'WETLAND',
  FOREST = 'FOREST',
  DESERT = 'DESERT',
  MOUNTAIN = 'MOUNTAIN'
}

export interface Tile {
  hex: Hex;
  type: TileType;
  tundra?: true;
}

export interface Corner {
  a: Hex;
  b: Hex;
  c: Hex;
}

export interface Element {
  corner: Corner;
  type: ElementType;
}

export enum ElementType {
  GRASS = 'GRASS',
  GRUB = 'GRUB',
  MEAT = 'MEAT',
  SUN = 'SUN',
  WATER = 'WATER',
  SEED = 'SEED'
}

export interface TileStack {
  onTop: TileType;
  size: number;
}

export enum ActionType {
  ABUNDANCE = 'ABUNDANCE',
  ADAPTATION = 'ADAPTATION',
  COMPETITION = 'COMPETITION',
  DEPLETION = 'DEPLETION',
  DOMINATION = 'DOMINATION',
  GLACIATION = 'GLACIATION',
  INITIATIVE = 'INITIATIVE',
  MIGRATION = 'MIGRATION',
  REGRESSION = 'REGRESSION',
  SPECIATION = 'SPECIATION',
  WANDERLUST = 'WANDERLUST',
  WASTELAND = 'WASTELAND'
}

export type ActionDisplay = {
  actionPawns: { [actionType in ActionType]: AnimalType[] };
  elements: { [actionType in ActionType]: ElementType[] };
};

export enum Phase {
  PLANNING = 'PLANNING',
  EXECUTION = 'EXECUTION'
}

export enum AnimalType {
  MAMMALS = 'MAMMALS',
  REPTILES = 'REPTILES',
  BIRDS = 'BIRDS',
  AMPHIBIANS = 'AMPHIBIANS',
  ARANCHIDS = 'ARANCHIDS',
  INSECTS = 'INSECTS'
}

export interface Animal {
  player: Player;
  type: AnimalType;
  genePool: number;
  actionPawns: number;
  score: number;
  elements: ElementType[];
}

export interface DrawBag {
  elements: { [elementType in ElementType]: number }
}

export interface DominantSpecies {
  round: number;
  phase: Phase;
  animals: { [animalType in AnimalType]: Animal };
  initiative: AnimalType[];
  tiles: Tile[];
  elements: Element[];
  currentAnimal: AnimalType;
  actionDisplay: ActionDisplay;
  drawBag: DrawBag;
}

export enum ActionName {
  PlaceActionPawn = 'PlaceActionPawn',
  Initiative = 'Initiative',
  Adaptation = 'Adaptation',
  Regression = 'Regression',
  Abundance = 'Abundance',
  Wasteland = 'Wasteland',
  Depletion = 'Depletion',
  Glaciation = 'Glaciation',
  Speciation = 'Speciation',
  Wanderlust = 'Wanderlust',
  Migration = 'Migration',
  Competition = 'Competition',
  Domination = 'Domination'
}

export interface State {
  state: DominantSpecies;
  actions: ActionName[];
}

const INITIAL_JUNGLE = {hex: {q: -1, r: 0}, type: TileType.JUNGLE};
const INITIAL_WETLAND = {hex: {q: 0, r: -1}, type: TileType.WETLAND};
const INITIAL_SAVANNAH = {hex: {q: 1, r: -1}, type: TileType.SAVANNAH};
const INITIAL_SEA = {hex: {q: 0, r: 0}, type: TileType.SEA, tundra: true};
const INITIAL_FOREST = {hex: {q: -1, r: 1}, type: TileType.FOREST};
const INITIAL_MOUNTAIN = {hex: {q: 0, r: 1}, type: TileType.MOUNTAIN};
const INITIAL_DESERT = {hex: {q: 1, r: 0}, type: TileType.DESERT};

export const INITIAL_TILES: Tile[] = [
  INITIAL_JUNGLE,
  INITIAL_WETLAND,
  INITIAL_SAVANNAH,
  INITIAL_SEA,
  INITIAL_FOREST,
  INITIAL_MOUNTAIN,
  INITIAL_DESERT
];

export const INITIAL_ELEMENTS: Element[] = [
  {corner: {a: INITIAL_JUNGLE.hex, b: INITIAL_WETLAND.hex, c: INITIAL_SEA.hex}, type: ElementType.GRUB},
  {corner: {a: INITIAL_JUNGLE.hex, b: INITIAL_FOREST.hex, c: {q: -2, r: 1}}, type: ElementType.GRUB},

  {corner: {a: INITIAL_SAVANNAH.hex, b: INITIAL_WETLAND.hex, c: INITIAL_SEA.hex}, type: ElementType.WATER},
  {corner: {a: INITIAL_JUNGLE.hex, b: INITIAL_WETLAND.hex, c: {q: -1, r: -1}}, type: ElementType.WATER},

  {corner: {a: INITIAL_SAVANNAH.hex, b: INITIAL_DESERT.hex, c: INITIAL_SEA.hex}, type: ElementType.GRASS},
  {corner: {a: INITIAL_SAVANNAH.hex, b: INITIAL_WETLAND.hex, c: {q: 1, r: -2}}, type: ElementType.GRASS},

  {corner: {a: INITIAL_MOUNTAIN.hex, b: INITIAL_DESERT.hex, c: INITIAL_SEA.hex}, type: ElementType.SUN},
  {corner: {a: INITIAL_SAVANNAH.hex, b: INITIAL_DESERT.hex, c: {q: 2, r: -1}}, type: ElementType.SUN},

  {corner: {a: INITIAL_MOUNTAIN.hex, b: INITIAL_FOREST.hex, c: INITIAL_SEA.hex}, type: ElementType.MEAT},
  {corner: {a: INITIAL_MOUNTAIN.hex, b: INITIAL_DESERT.hex, c: {q: 1, r: 1}}, type: ElementType.MEAT},

  {corner: {a: INITIAL_JUNGLE.hex, b: INITIAL_FOREST.hex, c: INITIAL_SEA.hex}, type: ElementType.SEED},
  {corner: {a: INITIAL_FOREST.hex, b: INITIAL_MOUNTAIN.hex, c: {q: -1, r: 2}}, type: ElementType.SEED},
];

/**
 * (Empty) hexes that make up the Dominant Species board.
 */
export const HEXES = Array(7).fill(0)
  .map((_, index) => index - 3)
  .flatMap(q => {
    let m = q == 0 ? 5 : 7 - Math.abs(q);
    return Array(m).fill(0)
      .map((_, index) => q == 0 ? index - 2 : q < 0 ? index - (m - 3) + 1 : index - 3)
      .map(r => ({q, r}) as Hex);
  });
