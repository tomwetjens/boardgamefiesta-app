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
  coordsToCorner,
  coordsToHex,
  cornerToCoords,
  DominantSpecies,
  Element,
  ElementType,
  getMaxSpeciation,
  HEXES,
  hexToCoords,
  SPECIATION_ELEMENT_TYPES,
  Species,
  Tile
} from '../model';
import {PanZoomConfig} from 'ngx-panzoom';
import {Table} from "../../shared/model";

interface HexItem {
  coords: AxialCoordinates;
  hex: Hexagon;
}

interface Cube {
  x: number;
  y: number;
}

interface CubeGroup {
  x: number;
  y: number;
  animalType: AnimalType;
  cubes: Cube[];
}

interface TileItem {
  tile: Tile;
  coords: AxialCoordinates;
  hex: Hexagon;
  species: Species;
  speciesDelta: Species;
  cubes: CubeGroup[];
}

interface ElementItem {
  element: Element;
  center: XYCoords;
}

interface CornerItem {
  corner: AxialCorner;
  center: XYCoords;
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

  tiles: TileItem[];
  addedTiles: TileItem[] = [];

  elements: ElementItem[];

  selectableCorners: CornerItem[];
  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    keepInBounds: true,
    freeMouseWheel: true,
    freeMouseWheelFactor: 0.001,
    panOnClickDrag: true
  });

  selectedElement: Element;
  selectedTile: Tile;
  selectedWanderlustTile: number;

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
            speciesDelta: {} as any,
            cubes: this.calculateCubes(tile.species)
          };
        }) || [];
      this.addedTiles = [];

      this.elements = this.state?.elements
        .map(element => {
          const coords = cornerToCoords(element.corner);
          return {
            center: this.layout.intersection(coords.a, coords.b, coords.c),
            element
          };
        }) || [];
    }

    if (changes.selectedAction) {
      this.selectableCorners = this.canSelectCorner ? this.calculateSelectableCorners() : [];
      this.selectedElementTypes = [];
      this.selectedElement = null;
      this.selectedCorner = null;
      this.selectedTile = null;
      this.selectedWanderlustTile = null;
      this.addedTiles = [];
    }
  }

  private calculateCubes(species: Species): CubeGroup[] {
    const animalTypes = Object.keys(species);
    return animalTypes
      .map((animalType, animalIndex) => {
        const amount = species[animalType];

        return {
          animalType,
          x: animalIndex * 30,
          y: 0,
          cubes: new Array(amount).fill(null)
            .map((_, cubeIndex) => {
              return {
                x: cubeIndex * 10,
                y: 0
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
        return this.tiles.some(tile => tile.speciesDelta[this.state.currentAnimal] > 0);
      case ActionName.Wanderlust:
        return this.addedTiles.length === 1;
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
        const speciatedTiles = this.tiles.filter(tile => tile.speciesDelta[this.state.currentAnimal] > 0);

        this.perform.emit({
          [this.selectedAction]: {
            element: this.selectedElement.corner,
            tiles: speciatedTiles.map(tile => tile.tile.hex),
            species: speciatedTiles.map(tile => tile.speciesDelta[this.state.currentAnimal])
          }
        });
        break;
      case ActionName.Wanderlust:
        return this.addedTiles.length === 1;
    }
  }

  reset() {
    this.tiles.forEach(tile => {
      tile.species = Object.assign({}, tile.species);
      tile.speciesDelta = {} as any;
      tile.cubes = this.calculateCubes(tile.species);
    });
  }

  selectHex(coords: AxialCoordinates) {
    if (!this.canSelectHex(coords)) {
      return;
    }

    console.debug('selectHex:', coords);

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
          speciesDelta: {} as any,
          cubes: []
        };

        this.addedTiles.push(tile);
        this.tiles.push(tile);

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
        const current = tile.species[this.state.currentAnimal] || 0;
        const currentDelta = tile.speciesDelta[this.state.currentAnimal] || 0;
        const maxSpeciation = getMaxSpeciation(tile.tile);
        if (currentDelta < maxSpeciation) {
          tile.species[this.state.currentAnimal] = current + 1;
          tile.speciesDelta[this.state.currentAnimal] = currentDelta + 1;
        } else {
          tile.species[this.state.currentAnimal] = current - currentDelta;
          if (tile.species[this.state.currentAnimal] === 0) {
            delete tile.species[this.state.currentAnimal];
          }
          delete tile.speciesDelta[this.state.currentAnimal];
        }
        tile.cubes = this.calculateCubes(tile.species);
        break;
    }
  }

  canSelectTile(tile: TileItem): boolean {
    switch (this.selectedAction) {
      case ActionName.Speciation:
        return this.selectedElement && isCornerAdjacent(cornerToCoords(this.selectedElement.corner), tile.coords);
      case ActionName.Glaciation:
        return !tile.tile.tundra && this.isAdjacentToTundra(tile.coords);
      default:
        return false;
    }
  }

  private isAdjacentToTundra(coords: AxialCoordinates): boolean {
    return this.tiles.some(b => b.tile.tundra && isAdjacent(b.coords, coords));
  }

  isTileSelected(tile: TileItem): boolean {
    return false;
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
    return SPECIATION_ELEMENT_TYPES[this.state.actionDisplay.actionPawns[ActionType.SPECIATION]
      .findIndex(actionPawn => actionPawn === this.state.currentAnimal)];
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

        this.selectedElement = element.element;

        const noLongerSelectableTiles = previousSelectableTiles.filter(tile => !this.canSelectTile(tile));
        noLongerSelectableTiles.forEach(tile => {
          // Reset any deltas
          tile.species = Object.assign({}, tile.tile.species);
          tile.speciesDelta = {} as any;
          tile.cubes = this.calculateCubes(tile.species);
        })
        break;
    }
  }

  isElementSelected(element: ElementItem): boolean {
    return this.selectedElement?.corner === element.element.corner;
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
      case ActionName.Wanderlust:
        this.selectableCorners = this.calculateSelectableCorners();
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
        return this.addedTiles.length === 0 && !!this.selectedWanderlustTile && this.isAdjacentToTile(coords);
      default:
        return false;
    }
  }

  private isAdjacentToTile(coords: AxialCoordinates): boolean {
    return this.state.tiles.some(tile => isAdjacent(coords, hexToCoords(tile.hex)));
  }
}


