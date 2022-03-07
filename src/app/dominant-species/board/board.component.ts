import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {
  AxialCoordinates,
  AxialCorner,
  AxialHexagonalGrid,
  cornersEqual,
  FlatAxialLayout,
  Hexagon,
  isAdjacent,
  isCornerAdjacent,
  XYCoords
} from '../hexagon';
import {
  Action,
  ActionName,
  ActionType,
  AnimalType,
  COMPETITION_TILE_TYPES,
  coordsToCorner,
  coordsToHex,
  cornerToCoords,
  DominantSpecies,
  Element,
  ElementType,
  getMaxSpeciation,
  HEXES,
  hexToCoords,
  MAX_SPECIES_TO_MIGRATE,
  SPECIATION_ELEMENT_TYPES,
  Species,
  Tile,
  TileType
} from '../model';
import {PanZoomConfig} from 'ngx-panzoom';
import {PlayerColor, Table} from "../../shared/model";

interface HexItem {
  coords: AxialCoordinates;
  hex: Hexagon;
}

interface Cube {
  x: number;
  y: number;
  size: number;
}

interface CubeGroup {
  x: number;
  y: number;
  rotation: number;
  animalType: AnimalType;
  cubes: Cube[];
}

interface Delta {
  added?: number;
  removed?: number;
}

interface TileItem {
  tile: Tile;
  coords: AxialCoordinates;
  hex: Hexagon;
  species: Species;
  deltas: { [animalType in AnimalType]?: Delta };
  cubes: CubeGroup[];
}

interface ElementItem {
  element: Element;
  coords: AxialCorner;
  center: XYCoords;
}

interface CornerItem {
  corner: AxialCorner;
  center: XYCoords;
}

interface MoveItem {
  from: TileItem;
  to: TileItem;
  text: XYCoords;
  species: number;
}

@Component({
  selector: 'ds-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {

  @Input() table: Table;

  @Input() state: DominantSpecies;

  @Input() selectedAction: ActionName;
  selectedElementTypes: ElementType[] = [];
  selectedCorner: AxialCorner;

  @Output() perform = new EventEmitter<Action>();
  grid = new AxialHexagonalGrid();

  layout = new FlatAxialLayout(100);

  hexes: HexItem[] = HEXES
    .map(coords => ({
      coords,
      hex: this.layout.render(coords)
    }));

  tileTypes = [TileType.SEA, TileType.SAVANNAH, TileType.MOUNTAIN, TileType.WETLAND, TileType.JUNGLE, TileType.FOREST, TileType.JUNGLE, TileType.DESERT];
  playerColors = [PlayerColor.BLACK, PlayerColor.BLUE, PlayerColor.RED, PlayerColor.GREEN, PlayerColor.WHITE, PlayerColor.YELLOW];

  tiles: TileItem[];
  addedTiles: TileItem[] = [];

  elements: ElementItem[];

  selectableCorners: CornerItem[] = [];
  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    keepInBounds: true,
    freeMouseWheel: true,
    freeMouseWheelFactor: 0.001,
    panOnClickDrag: true
  });

  selectedElement: ElementItem;
  selectedTiles: TileItem[] = [];
  selectedAnimalTypes: AnimalType[] = [];
  selectedWanderlustTile: number;

  moves: MoveItem[] = [];

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      this.tiles = this.state?.tiles
        .map(tile => {
          const coords = hexToCoords(tile.hex);
          return {
            tile,
            coords,
            hex: this.layout.render(coords),
            species: Object.assign({}, tile.species) as any,
            deltas: {} as any,
            cubes: this.calculateCubes(tile.species)
          };
        }) || [];
      this.addedTiles = [];

      this.elements = this.state?.elements
        .map(element => {
          const coords = cornerToCoords(element.corner);
          return {
            coords,
            center: this.layout.intersection(coords.a, coords.b, coords.c),
            element
          };
        }) || [];
    }

    if (changes.state || changes.selectedAction) {
      this.selectableCorners = this.canSelectCorner ? this.calculateSelectableCorners() : [];
      this.selectedElementTypes = [];
      this.selectedElement = null;
      this.selectedCorner = null;
      this.selectedTiles = [];
      this.selectedAnimalTypes = [];
      this.selectedWanderlustTile = null;
      this.addedTiles = [];
      this.moves = [];

      switch (this.selectedAction) {
        case ActionName.Speciation:
          const selectableElements = this.elements.filter(element => this.canSelectElement(element));
          if (selectableElements.length === 1) {
            this.selectedElement = selectableElements[0];
          }
          break;
      }
    }
  }

  private calculateCubes(species: Species): CubeGroup[] {
    const animalTypes = Object.keys(species);

    const cubeSize = 10;
    const maxCubesToDisplay = 8;

    const radiusOfGroupsCircle = 50;
    const anglePerGroup = (2 * Math.PI) / animalTypes.length;

    return animalTypes
      .map((animalType, groupIndex) => {
        const numberOfCubesToDisplay = Math.min(maxCubesToDisplay, species[animalType] || 0);

        const groupCenterX = Math.round(Math.cos(anglePerGroup * groupIndex) * radiusOfGroupsCircle);
        const groupCenterY = Math.round(Math.sin(anglePerGroup * groupIndex) * radiusOfGroupsCircle);

        const anglePerCube = numberOfCubesToDisplay <= 1 ? 0
          : numberOfCubesToDisplay === 3 ? (2 * Math.PI) / numberOfCubesToDisplay
            : (2 * Math.PI) / (numberOfCubesToDisplay - 1);
        const radiusOfCubesCircle = numberOfCubesToDisplay === 3 ? cubeSize : cubeSize + 4;

        return {
          animalType,
          x: groupCenterX,
          y: groupCenterY,
          rotation: Math.round(-10 + Math.random() * 20),
          cubes: new Array(numberOfCubesToDisplay).fill(null)
            .map((_, cubeIndex) => {
              const cubeX = numberOfCubesToDisplay === 3 || cubeIndex > 0
                ? Math.round(Math.cos(anglePerCube * cubeIndex) * radiusOfCubesCircle) : 0;
              const cubeY = numberOfCubesToDisplay === 3 || cubeIndex > 0
                ? Math.round(Math.sin(anglePerCube * cubeIndex) * radiusOfCubesCircle) : 0;

              return {
                x: cubeX,
                y: cubeY,
                size: cubeSize
              } as Cube;
            })
        } as CubeGroup;
      });
  }

  get canSelectCorner(): boolean {
    switch (this.selectedAction) {
      case ActionName.Abundance:
        return this.selectedElementTypes.length === 1;
      case ActionName.Wanderlust:
        return this.addedTiles.length === 1 && this.selectedElementTypes.length === 1;
      default:
        return false;
    }
  }

  get canConfirm(): boolean {
    switch (this.selectedAction) {
      case ActionName.Regression:
        return true; // 0 or more element types selected
      case ActionName.Speciation:
      case ActionName.WanderlustMove:
      case ActionName.Migration:
      case ActionName.Aquatic:
        return this.tiles.some(tile => tile.deltas[this.state.currentAnimal]?.added > 0);
      case ActionName.Wanderlust:
        return this.addedTiles.length === 1;
      case ActionName.Competition:
        return this.selectedTiles.length > 0 && this.selectedAnimalTypes.length === this.selectedTiles.length;
      default:
        return false;
    }
  }

  confirm() {
    switch (this.selectedAction) {
      case ActionName.Regression:
        this.perform.emit({
          [this.selectedAction]: {
            elementTypes: this.selectedElementTypes
          }
        });
        break;

      case ActionName.Speciation:
        const speciatedTiles = this.tiles.filter(tile => tile.deltas[this.state.currentAnimal]?.added > 0);

        this.perform.emit({
          [this.selectedAction]: {
            element: this.selectedElement?.element.corner,
            tiles: speciatedTiles.map(tile => tile.tile.hex),
            species: speciatedTiles.map(tile => tile.deltas[this.state.currentAnimal].added)
          }
        });
        break;

      case ActionName.Aquatic:
        const changedAquaticTiles = this.tiles.filter(tile => tile.deltas[this.state.currentAnimal]?.added > 0);

        this.perform.emit({
          [this.selectedAction]: {
            tile: this.selectedTiles[0].tile.hex,
            species: changedAquaticTiles.map(tile => tile.deltas[this.state.currentAnimal].added).reduce((a, b) => a + b, 0)
          }
        });
        break;

      case ActionName.Wanderlust:
        return this.addedTiles.length === 1;

      case ActionName.WanderlustMove:
        const changedTiles = this.tiles.filter(tile => tile.deltas[this.state.currentAnimal]?.removed > 0);

        this.perform.emit({
          [this.selectedAction]: {
            moves: changedTiles.map(tile => {
              return {
                from: tile.tile.hex,
                species: tile.deltas[this.state.currentAnimal].removed
              };
            })
          }
        });
        break;

      case ActionName.Migration:
        this.perform.emit({
          [this.selectedAction]: {
            moves: this.moves.map(move => {
              return {
                from: move.from.tile.hex,
                to: move.to.tile.hex,
                species: move.species
              };
            })
          }
        });
        break;

      case ActionName.Competition:
        this.perform.emit({
          [this.selectedAction]: {
            tiles: this.selectedTiles.map(tile => tile.tile.hex),
            animals: this.selectedAnimalTypes
          }
        });
        break;

    }
  }

  reset() {
    this.selectedTiles = [];
    this.selectedAnimalTypes = [];
    this.tiles.forEach(tile => {
      tile.species = Object.assign({}, tile.species);
      tile.deltas = {} as any;
      tile.cubes = this.calculateCubes(tile.species);
    });
  }

  selectHex(coords: AxialCoordinates) {
    console.debug('selectHex:', coords);

    if (!this.canSelectHex(coords)) {
      return;
    }

    switch (this.selectedAction) {
      case ActionName.Wanderlust:
        const tile: TileItem = {
          coords,
          hex: this.layout.render(coords),
          tile: {
            hex: coordsToHex(coords),
            type: this.state.wanderlustTiles[this.selectedWanderlustTile].faceUp,
            species: {} as Species,
            dominant: null
          },
          species: {} as Species,
          deltas: {} as any,
          cubes: []
        };

        this.addedTiles.push(tile);
        this.tiles.push(tile);

        if (this.selectedElementTypes.length === 1) {
          this.selectableCorners = this.calculateSelectableCorners();
        }

        break;
    }
  }

  selectTile(tile: TileItem) {
    if (!this.canSelectTile(tile)) {
      return;
    }

    console.debug('selectTile:', tile);

    switch (this.selectedAction) {
      case ActionName.Glaciation:
        this.perform.emit({
          [this.selectedAction]: {
            tile: tile.tile.hex
          }
        });
        break;

      case ActionName.Speciation:
        this.speciation(tile);
        break;

      case ActionName.WanderlustMove:
        this.wanderlustMove(tile);
        break;

      case ActionName.Migration:
        if (this.selectedTiles.length === 1) {
          if (this.selectedTiles[0] === tile) {
            this.selectedTiles = [];
          } else {
            this.migration(tile);
          }
        } else {
          this.selectedTiles.push(tile);
        }
        break;

      case ActionName.Domination:
        this.perform.emit({
          [this.selectedAction]: {
            tile: tile.tile.hex
          }
        });
        break;

      case ActionName.Aquatic:
        this.aquatic(tile);
        break;
    }
  }

  private migration(to: TileItem) {
    this.move(this.selectedTiles[0], to);

    if (!this.hasPreExistingSpeciesLeftOnTile(this.selectedTiles[0])
      || !this.hasNotReachedMaxSpeciesToMigrate()
      || !this.tiles.some(tile => this.canMigrateSpeciesTo(tile))) {
      this.selectedTiles = [];
    }
  }

  private wanderlustMove(from: TileItem) {
    const to = this.tiles.find(other => other.tile.hex === this.state.lastPlacedTile);
    this.move(from, to);
  }

  private move(from: TileItem, to: TileItem) {
    this.changeSpecies(from, -1);
    this.changeSpecies(to, 1);
    this.addOrMergeMove(from, to, 1);
  }

  private aquatic(tile: TileItem) {
    if (this.selectedTiles.length > 0 && this.selectedTiles[0] !== tile) {
      this.resetChangedSpecies(this.selectedTiles[0]);
    }
    this.selectedTiles = [tile];

    const currentDelta = tile.deltas[this.state.currentAnimal]?.added || 0;
    if (currentDelta < 4) {
      this.changeSpecies(tile, 1);
    } else {
      this.resetChangedSpecies(tile);
    }
  }

  private speciation(tile: TileItem) {
    const currentDelta = tile.deltas[this.state.currentAnimal]?.added || 0;
    const maxSpeciation = getMaxSpeciation(tile.tile);
    if (currentDelta < maxSpeciation) {
      this.changeSpecies(tile, 1);
    } else {
      this.resetChangedSpecies(tile);
    }
  }

  private changeSpecies(tile: TileItem, amount: number = 1) {
    const animalType = this.state.currentAnimal;
    const deltas = tile.deltas[animalType] || {};

    if (amount < 0) {
      deltas.removed = (deltas?.removed || 0) - amount;
    } else if (amount > 0) {
      deltas.added = (deltas?.added || 0) + amount;
    }

    if (deltas?.added === 0 && deltas?.removed === 0) {
      delete tile.deltas[animalType];
    }

    tile.deltas[animalType] = deltas;

    const preExistingSpecies = tile.tile.species[animalType] || 0;
    const newSpecies = preExistingSpecies + (deltas?.added || 0) - (deltas?.removed || 0);

    if (newSpecies === 0) {
      delete tile.species[animalType];
    } else {
      tile.species[animalType] = newSpecies;
    }

    tile.cubes = this.calculateCubes(tile.species);
  }

  private resetChangedSpecies(tile: TileItem) {
    tile.species[this.state.currentAnimal] = tile.tile.species[this.state.currentAnimal] || 0;
    if (tile.species[this.state.currentAnimal] === 0) {
      delete tile.species[this.state.currentAnimal];
    }
    delete tile.deltas[this.state.currentAnimal];

    tile.cubes = this.calculateCubes(tile.species);
  }

  canSelectTile(tile: TileItem): boolean {
    switch (this.selectedAction) {
      case ActionName.Speciation:
        return this.selectedElement && isCornerAdjacent(this.selectedElement.coords, tile.coords);
      case ActionName.Glaciation:
        return !tile.tile.tundra && this.isAdjacentToTundra(tile.coords);
      case ActionName.WanderlustMove:
        return isAdjacent(hexToCoords(this.state.lastPlacedTile), tile.coords)
          && this.hasPreExistingSpeciesLeftOnTile(tile);
      case ActionName.Migration:
        return (this.selectedTiles.length === 1 && this.selectedTiles[0] === tile) || (this.selectedTiles.length === 1
          /*selecting to...*/ ? this.canMigrateSpeciesTo(tile)
          /*selecting from...*/ : this.hasPreExistingSpeciesLeftOnTile(tile));
      case ActionName.Domination:
        return !this.state.scoredTiles.includes(tile.tile.hex);
      case ActionName.Aquatic:
        return [TileType.WETLAND, TileType.SEA].includes(tile.tile.type);
      default:
        return false;
    }
  }

  private hasPreExistingSpeciesLeftOnTile(tile: TileItem) {
    const preExistingSpecies = tile.tile.species[this.state.currentAnimal] || 0;
    const removed = tile.deltas[this.state.currentAnimal]?.removed || 0;
    const preExistingSpeciesLeft = removed > 0 ? preExistingSpecies - removed : preExistingSpecies;
    return preExistingSpeciesLeft > 0;
  }

  private canMigrateSpeciesTo(tile: TileItem) {
    return (isAdjacent(this.selectedTiles[0].coords, tile.coords)
      || (this.state.currentAnimal === AnimalType.BIRDS && this.isTwoTilesAway(this.selectedTiles[0], tile)))
      && this.hasNotReachedMaxSpeciesToMigrate()
      && this.hasPreExistingSpeciesLeftOnTile(this.selectedTiles[0]);
  }

  private isTwoTilesAway(from: TileItem, to: TileItem) {
    return this.tiles.some(tile => tile !== from && tile !== to
      && isAdjacent(tile.coords, from.coords) && isAdjacent(tile.coords, to.coords));
  }

  private isAdjacentToTundra(coords: AxialCoordinates): boolean {
    return this.tiles.some(b => b.tile.tundra && isAdjacent(b.coords, coords));
  }

  isTileSelected(tile: TileItem): boolean {
    return this.selectedTiles.includes(tile);
  }

  selectCorner(corner: AxialCorner) {
    console.debug('selectCorner:', corner);
    this.selectedCorner = corner;
    this.performOnceEverythingSelected();
  }

  canSelectElement(element: ElementItem): boolean {
    switch (this.selectedAction) {
      case ActionName.Depletion:
        return this.state.actionDisplay.elements[ActionType.DEPLETION].includes(element.element.type);
      case ActionName.Speciation:
        const speciationElementType = this.getSpeciationElementType();
        return element.element.type === speciationElementType && this.isNotInsectsFreeAction();
      default:
        return false;
    }
  }

  private getSpeciationElementType() {
    return SPECIATION_ELEMENT_TYPES[this.getCurrentActionPawnIndex(ActionType.SPECIATION)];
  }

  private getCurrentActionPawnIndex(actionType: ActionType) {
    return this.state.actionDisplay.actionPawns[actionType]
      .findIndex(actionPawn => actionPawn === this.state.currentAnimal);
  }

  private isNotInsectsFreeAction() {
    return this.state.currentAnimal !== AnimalType.INSECTS ||
      this.state.actionDisplay.actionPawns[ActionType.SPECIATION].some(actionPawn => !!actionPawn);
  }

  selectElement(element: ElementItem) {
    if (!this.canSelectElement(element)) {
      return;
    }

    switch (this.selectedAction) {
      case ActionName.Depletion:
        this.perform.emit({
          [this.selectedAction]: {
            corner: element.element.corner
          }
        });
        break;

      case ActionName.Speciation:
        const previousSelectableTiles = this.tiles.filter(tile => this.canSelectTile(tile));

        this.selectedElement = element;

        const noLongerSelectableTiles = previousSelectableTiles.filter(tile => !this.canSelectTile(tile));
        noLongerSelectableTiles.forEach(tile => {
          // Reset any deltas
          tile.species = Object.assign({}, tile.tile.species);
          tile.deltas = {} as any;
          tile.cubes = this.calculateCubes(tile.species);
        })
        break;
    }
  }

  isElementSelected(element: ElementItem): boolean {
    return this.selectedElement?.element.corner === element.element.corner;
  }

  selectElementType(elementType: ElementType) {
    console.debug('selectElementType:', elementType);

    if (this.selectedElementTypes.includes(elementType)) {
      const index = this.selectedElementTypes.indexOf(elementType);
      this.selectedElementTypes.splice(index, 1);
    } else {
      this.selectedElementTypes.push(elementType);
    }

    switch (this.selectedAction) {
      case ActionName.Adaptation:
      case ActionName.Wasteland:
        this.perform.emit({
          [this.selectedAction]: {
            elementType
          }
        });
        break;

      case ActionName.Abundance:
        this.selectableCorners = this.calculateSelectableCorners();
        break;

      case ActionName.Wanderlust:
        if (this.addedTiles.length === 1) {
          this.selectableCorners = this.calculateSelectableCorners();
        }
        break;

      default:
        this.performOnceEverythingSelected();
    }
  }

  trackByHex(index: number, hex: HexItem): any {
    return coordsToHex(hex.coords);
  }

  trackByTile(index: number, tile: TileItem): any {
    return tile.tile.hex;
  }

  trackByElement(index: number, element: ElementItem): any {
    return element.element.corner;
  }

  trackByCorner(index: number, corner: CornerItem): any {
    return corner;
  }

  trackByCubeGroup(index: number, cubeGroup: CubeGroup): any {
    return cubeGroup.animalType;
  }

  trackByCube(index: number, cube: Cube): any {
    return index;
  }

  private calculateSelectableCorners(): CornerItem[] {
    switch (this.selectedAction) {
      case ActionName.Abundance:
        return this.calculateEmptyCornersOnTiles();
      case ActionName.Wanderlust:
        return this.addedTiles
          .map(tile => tile.coords)
          .flatMap(a =>
            this.grid.neighbors(a)
              .flatMap(b => this.grid.neighbors(a)
                .filter(c => isAdjacent(b, c))
                .map(c => ({a, b, c} as AxialCorner))
                .filter(corner => !this.hasElement(corner))
                .map(corner => ({
                  corner,
                  center: this.layout.intersection(corner.a, corner.b, corner.c)
                } as CornerItem))));
      default:
        return [];
    }
  }

  private calculateEmptyCornersOnTiles() {
    return this.state?.tiles // start from the existing tiles so we at least have an adjacent tile (reduces search space)
      .map(tile => hexToCoords(tile.hex))
      .flatMap(a =>
        HEXES
          .filter(b => isAdjacent(a, b)) // if all 3 hexes that make a corner must be adjacent, then at least 2 must be adjacent as well
          .flatMap(b =>
            HEXES
              .filter(c => isAdjacent(b, c) && isAdjacent(c, a)) // 3rd hex must be adjacent to first two
              .filter(c => !this.hasElement({a, b, c})) // corner must not have an element yet
              .flatMap(c => {
                return {
                  corner: {a, b, c},
                  center: this.layout.intersection(a, b, c)
                };
              })));
  }


  private hasTile(coords: AxialCoordinates) {
    const hex = coordsToHex(coords);
    return this.state.tiles.some(tile => tile.hex === hex);
  }

  private hasElement(corner: AxialCorner): boolean {
    return this.state.elements
      .map(elem => cornerToCoords(elem.corner))
      .some(coords => cornersEqual(coords, corner));
  }

  private performOnceEverythingSelected() {
    switch (this.selectedAction) {
      case ActionName.Abundance:
        if (this.selectedCorner && this.selectedElementTypes.length === 1) {
          this.perform.emit({
            [this.selectedAction]: {
              corner: coordsToCorner(this.selectedCorner),
              elementType: this.selectedElementTypes[0]
            }
          });
        }
        break;

      case ActionName.Wasteland:
        if (this.selectedElementTypes.length === 1) {
          this.perform.emit({
            [this.selectedAction]: {
              elementType: this.selectedElementTypes[0]
            }
          });
        }
        break;

      case ActionName.Wanderlust:
        if (this.addedTiles.length === 1 && this.selectedCorner && this.selectedElementTypes.length === 1) {
          this.perform.emit({
            [this.selectedAction]: {
              stack: this.selectedWanderlustTile,
              hex: this.addedTiles[0].tile.hex,
              elementType: this.selectedElementTypes[0],
              corner: coordsToCorner(this.selectedCorner)
            }
          })
        }
        break;
    }
  }

  get canSelectWanderlustTile(): boolean {
    return this.selectedAction === ActionName.Wanderlust;
  }

  selectWanderlustTile(index: number) {
    if (!this.canSelectWanderlustTile) {
      return;
    }

    console.debug('selectWanderlustTile:', index);

    this.selectedWanderlustTile = index;
    this.addedTiles.forEach(addedTile =>
      this.tiles.splice(this.tiles.findIndex(tile => tile === addedTile), 1));
    this.addedTiles = [];
  }

  canSelectHex(coords: AxialCoordinates): boolean {
    switch (this.selectedAction) {
      case ActionName.Wanderlust:
        return this.addedTiles.length === 0 && (typeof this.selectedWanderlustTile === 'number') && this.isAdjacentToTile(coords);
      default:
        return false;
    }
  }

  private isAdjacentToTile(coords: AxialCoordinates): boolean {
    return this.state.tiles.some(tile => isAdjacent(coords, hexToCoords(tile.hex)));
  }

  private addOrMergeMove(from: TileItem, to: TileItem, species: number) {
    const existing = this.moves.find(move => move.from === from && move.to === to);

    if (existing) {
      existing.species += species;
    } else {
      const text: XYCoords = {
        x: from.hex.center.x + (to.hex.center.x - from.hex.center.x) / 2,
        y: from.hex.center.y + (to.hex.center.y - from.hex.center.y) / 2
      };

      this.moves.push({from, to, text, species});
    }
  }

  private hasNotReachedMaxSpeciesToMigrate(): boolean {
    const maxSpecies = MAX_SPECIES_TO_MIGRATE[this.getCurrentActionPawnIndex(ActionType.MIGRATION)];
    const speciesMoved = this.tiles
      .map(tile => tile.deltas[this.state.currentAnimal]?.removed || 0)
      .filter(removed => removed > 0)
      .reduce((a, b) => a + b, 0);
    return speciesMoved < maxSpecies;
  }

  canSelectSpecies(tile: TileItem, animalType: AnimalType) {
    switch (this.selectedAction) {
      case ActionName.Competition:
        return animalType !== this.state.currentAnimal && tile.species[animalType] > 0 && tile.species[this.state.currentAnimal] > 0
          && COMPETITION_TILE_TYPES[this.getCurrentActionPawnIndex(ActionType.COMPETITION)].includes(tile.tile.type);

      default:
        return false;
    }
  }

  selectSpecies(tile: TileItem, animalType: AnimalType) {
    if (!this.canSelectSpecies(tile, animalType)) {
      return;
    }

    console.debug('selectSpecies:', {tile, animalType});

    switch (this.selectedAction) {
      case ActionName.Competition:
        if (this.selectedTiles.includes(tile)) {
          const index = this.selectedTiles.indexOf(tile);
          this.selectedTiles.splice(index, 1);
          this.selectedAnimalTypes.splice(index, 1);
        } else {
          const existingOfSameType = this.selectedTiles.findIndex(selected => selected.tile.type === tile.tile.type);
          if (existingOfSameType >= 0) {
            this.selectedTiles.splice(existingOfSameType, 1);
            this.selectedAnimalTypes.splice(existingOfSameType, 1);
          }

          this.selectedTiles.push(tile);
          this.selectedAnimalTypes.push(animalType);
        }
        return;
    }
  }

  isSpeciesSelected(tile: TileItem, animalType: AnimalType): boolean {
    const index = this.selectedTiles.indexOf(tile);
    return index >= 0 && this.selectedAnimalTypes[index] === animalType;
  }
}


