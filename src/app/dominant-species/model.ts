import {Player} from "../shared/model";
import {AxialCoordinates, AxialCorner} from "./hexagon";

export interface Action {
  [actionName: string]: object
}

export type Hex = string;

export enum TileType {
  JUNGLE = 'JUNGLE',
  SAVANNAH = 'SAVANNAH',
  SEA = 'SEA',
  WETLAND = 'WETLAND',
  FOREST = 'FOREST',
  DESERT = 'DESERT',
  MOUNTAIN = 'MOUNTAIN'
}

export type Species = { [animalType in AnimalType]?: number };

export interface Tile {
  hex: Hex;
  type: TileType;
  tundra?: true;
  dominant: AnimalType;
  species: Species;
}

export type Corner = string;

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
  elements: { [actionType in ActionType]?: ElementType[] };
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
  ARACHNIDS = 'ARACHNIDS',
  INSECTS = 'INSECTS'
}

export interface Animal {
  player: Player;
  type: AnimalType;
  genePool: number;
  eliminatedSpecies: number;
  actionPawns: number;
  score: number;
  elements: ElementType[];
}

export interface DrawBag {
  elements: { [elementType in ElementType]: number }
}

export enum Card {
  AQUATIC = 'AQUATIC',
  BIODIVERSITY = 'BIODIVERSITY',
  BIOMASS = 'BIOMASS',
  BLIGHT = 'BLIGHT',
  CATASTROPHE = 'CATASTROPHE',
  COLD_SNAP = 'COLD_SNAP',
  DISEASE = 'DISEASE',
  ECODIVERSITY = 'ECODIVERSITY',
  EVOLUTION = 'EVOLUTION',
  FECUNDITY = 'FECUNDITY',
  FERTILE = 'FERTILE',
  HABITAT = 'HABITAT',
  HIBERNATION = 'HIBERNATION',
  ICE_AGE = 'ICE_AGE',
  ICE_SHEET = 'ICE_SHEET',
  IMMIGRANTS = 'IMMIGRANTS',
  INSTINCT = 'INSTINCT',
  INTELLIGENCE = 'INTELLIGENCE',
  MASS_EXODUS = 'MASS_EXODUS',
  METAMORPHOSIS = 'METAMORPHOSIS',
  NICHE_BIOMES = 'NICHE_BIOMES',
  NOCTURNAL = 'NOCTURNAL',
  OMNIVORE = 'OMNIVORE',
  PARASITISM = 'PARASITISM',
  PREDATOR = 'PREDATOR',
  SYMBIOTIC = 'SYMBIOTIC'
}

export interface TileStack {
  faceUp?: TileType;
  size: number;
}

export type WanderlustTiles = TileStack[];

export interface DominantSpecies {
  actionDisplay: ActionDisplay;
  actions: ActionName[];
  animals: { [animalType in AnimalType]?: Animal };
  availableCards: Card[];
  availableTundraTiles: number;
  canUndo: boolean;
  currentAnimal: AnimalType;
  deckSize: number;
  drawBag: DrawBag;
  elements: Element[];
  initiativeTrack: AnimalType[];
  lastPlacedTile?: Hex;
  scoredTiles: Hex[];
  phase: Phase;
  players: { [playerId: string]: AnimalType };
  round: number;
  tiles: Tile[];
  wanderlustTiles: WanderlustTiles;
}

export enum ActionName {
  Abundance = 'Abundance',
  Adaptation = 'Adaptation',
  Aquatic = 'Aquatic',
  Biomass = 'Biomass',
  Blight = 'Blight',
  Catastrophe = 'Catastrophe',
  Competition = 'Competition',
  Depletion = 'Depletion',
  DominanceCard = 'DominanceCard',
  Domination = 'Domination',
  Evolution = 'Evolution',
  Fecundity = 'Fecundity',
  Fertile = 'Fertile',
  Glaciation = 'Glaciation',
  Habitat = 'Habitat',
  Hibernation = 'Hibernation',
  MassExodus = 'MassExodus',
  Metamorphosis = 'Metamorphosis', // TODO
  Migration = 'Migration',
  PlaceActionPawn = 'PlaceActionPawn',
  Predator = 'Predator',
  Regression = 'Regression',
  RemoveActionPawn = 'RemoveActionPawn', // TODO
  RemoveAllBut1SpeciesOnEachTile = 'RemoveAllBut1SpeciesOnEachTile', // TODO
  RemoveElement = 'RemoveElement',
  SaveFromExtinction = 'SaveFromExtinction',
  Speciation = 'Speciation',
  Wanderlust = 'Wanderlust',
  WanderlustMove = 'WanderlustMove',
  Wasteland = 'Wasteland',
}

/**
 * (Empty) hexes that make up the Dominant Species board.
 */
export const HEXES = Array(7).fill(0)
  .map((_, index) => index - 3)
  .flatMap(q => {
    let m = q == 0 ? 5 : 7 - Math.abs(q);
    return Array(m).fill(0)
      .map((_, index) => q == 0 ? index - 2 : q < 0 ? index - (m - 3) + 1 : index - 3)
      .map(r => ({q, r}) as AxialCoordinates);
  });

export function hexToCoords(hex: Hex): AxialCoordinates {
  const parts = hex.split(/[(),]/, 4);
  if (parts.length != 4) throw new Error("invalid hex: " + hex);
  return {q: parseInt(parts[1]), r: parseInt(parts[2])};
}

export function coordsToHex(coords: AxialCoordinates): Hex {
  return '(' + coords.q + ',' + coords.r + ')';
}

export function cornerToCoords(corner: Corner): { a: AxialCoordinates, b: AxialCoordinates, c: AxialCoordinates } {
  const parts = corner.split(/[(),]+/, 8);
  if (parts.length != 8) throw new Error("invalid corner: " + corner);
  return {
    a: {q: parseInt(parts[1]), r: parseInt(parts[2])},
    b: {q: parseInt(parts[3]), r: parseInt(parts[4])},
    c: {q: parseInt(parts[5]), r: parseInt(parts[6])}
  };
}

export function coordsToCorner(coords: AxialCorner): Corner {
  return '((' + coords.a.q + ',' + coords.a.r + '),(' + coords.b.q + ',' + coords.b.r + '),(' + coords.c.q + ',' + coords.c.r + '))';
}

export function getMaxSpeciation(tile: Tile): number {
  if (tile.tundra) {
    return 1;
  }
  switch (tile.type) {
    case TileType.SEA:
    case TileType.WETLAND:
      return 4;
    case TileType.SAVANNAH:
    case TileType.JUNGLE:
    case TileType.FOREST:
      return 3;
    case TileType.DESERT:
    case TileType.MOUNTAIN:
      return 2;
  }
}

export const SPECIATION_ELEMENT_TYPES = [ElementType.MEAT, ElementType.SUN, ElementType.SEED, ElementType.WATER, ElementType.GRUB, ElementType.GRASS];

export const MAX_SPECIES_TO_MIGRATE = [7, 6, 5, 4, 3, 2];

export const COMPETITION_TILE_TYPES = [
  [TileType.SEA, TileType.DESERT, TileType.FOREST, TileType.JUNGLE, TileType.WETLAND, TileType.MOUNTAIN, TileType.SAVANNAH],
  [TileType.JUNGLE, TileType.WETLAND],
  [TileType.WETLAND, TileType.DESERT],
  [TileType.DESERT, TileType.FOREST],
  [TileType.FOREST, TileType.SAVANNAH],
  [TileType.SAVANNAH, TileType.MOUNTAIN],
  [TileType.MOUNTAIN, TileType.SEA],
  [TileType.SEA, TileType.JUNGLE]
];
