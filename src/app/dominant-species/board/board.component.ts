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
  Animal,
  AnimalType,
  Card,
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
import {fromPromise} from "rxjs/internal-compatibility";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {EndedDialogComponent} from "../ended-dialog/ended-dialog.component";

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

type Deltas = { [animalType in AnimalType]?: Delta };

interface TileItem {
  tile: Tile;
  coords: AxialCoordinates;
  hex: Hexagon;
  species: Species;
  deltas: Deltas;
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
  center: XYCoords;
  animalType: AnimalType;
  species: number;
}

const DIRECT_ACTIONS = [
  ActionName.RemoveActionPawn,
  ActionName.RemoveAllBut1SpeciesOnEachTile
];

function hasDeltas(tile: TileItem) {
  return tile.deltas && Object.keys(tile.deltas).some(key => tile.deltas[key]?.removed > 0 || tile.deltas[key]?.added > 0);
}

function hasSpeciesOnTile(tile: TileItem) {
  return tile.species && Object.keys(tile.species).some(key => tile.species[key] > 0);
}

function getTotalSpecies(tile: TileItem) {
  return tile.tile.species && Object.keys(tile.tile.species).map(key => tile.tile.species[key]).reduce((a, b) => a + b, 0);
}

@Component({
  selector: 'ds-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, OnChanges {

  private dialog: NgbModalRef;

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

  selectedElements: ElementItem[] = [];
  selectedTiles: TileItem[] = [];
  selectedAnimalTypes: AnimalType[] = [];
  selectedWanderlustTile: number;

  moves: MoveItem[] = [];

  constructor(private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      this.tiles = this.calculateTiles();
      this.addedTiles = [];
      this.elements = this.calculateElements();
    }

    if (changes.state || changes.selectedAction) {
      this.selectableCorners = this.canSelectCorner ? this.calculateSelectableCorners() : [];
      this.selectedElementTypes = [];
      this.selectedElements = [];
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
            this.selectedElements = [selectableElements[0]];
          }
          break;
      }

      if (this.table.ended) {
        if (!this.dialog) {
          this.dialog = this.ngbModal.open(EndedDialogComponent, {scrollable: true, size: 'lg'});

          const componentInstance = this.dialog.componentInstance as EndedDialogComponent;
          componentInstance.table = this.table;

          fromPromise(this.dialog.result).subscribe({
            error: () => this.dialog = null,
            complete: () => this.dialog = null
          });
        }
      }
    }
  }

  private calculateElements() {
    return this.state?.elements
      .map(element => {
        const coords = cornerToCoords(element.corner);
        return {
          coords,
          center: this.layout.intersection(coords.a, coords.b, coords.c),
          element
        };
      }) || [];
  }

  private calculateTiles() {
    return this.state?.tiles
      .map(tile => {
        const coords = hexToCoords(tile.hex);
        return {
          tile,
          coords,
          hex: this.layout.render(coords),
          species: Object.assign({}, tile.species) as any,
          deltas: {} as any,
          cubes: this.calculateCubes(tile.species, {})
        };
      }) || [];
  }

  private calculateCubes(species: Species, deltas: Deltas): CubeGroup[] {
    const animalTypes = [...new Set(Object.keys(species)
      .concat(Object.keys(deltas).filter(k => deltas[k]?.added > 0 || deltas[k]?.removed > 0)))];

    const cubeSize = 10;
    const maxCubesToDisplay = 8;

    const radiusOfGroupsCircle = 50;
    const anglePerGroup = (2 * Math.PI) / animalTypes.length;

    return animalTypes
      .sort()
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
      case ActionName.Aquatic:
      case ActionName.Habitat:
        return this.selectedElementTypes.length > 0 && !this.selectedCorner;
      case ActionName.Wanderlust:
        return this.addedTiles.length > 0 && this.selectedElementTypes.length > 0;
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
      case ActionName.Fecundity:
        return this.tiles.some(tile => tile.deltas[this.state.currentAnimal]?.added > 0);
      case ActionName.Predator:
        return this.tiles.filter(tile => this.hasSpeciesOnTile(tile))
          .every(tile => Object.keys(tile.deltas).some(at => this.isOpposing(at as AnimalType) && tile.deltas[at]?.removed > 0));
      case ActionName.Biomass:
        return this.tiles
          .filter(tile => getTotalSpecies(tile) > this.getAdjacentElements(tile).length)
          .every(tile => hasDeltas(tile));
      case ActionName.Hibernation:
        return this.selectedTiles.length > 0 && hasDeltas(this.selectedTiles[0]);
      case ActionName.Aquatic:
        return this.selectedCorner && this.selectedElementTypes.length > 0;
      case ActionName.Wanderlust:
        return this.addedTiles.length === 1;
      case ActionName.Competition:
        return this.selectedTiles.length > 0 && this.selectedAnimalTypes.length === this.selectedTiles.length;
      case ActionName.Evolution:
        return this.selectedTiles.length > 0 && this.selectedAnimalTypes.length > 0;
      case ActionName.Catastrophe:
        return this.selectedTiles.length > 0 && hasDeltas(this.selectedTiles[0])
          && this.tiles.filter(tile => isAdjacent(tile.coords, this.selectedTiles[0].coords)).every(adjacent => hasDeltas(adjacent));
      case ActionName.MassExodus:
        return this.selectedTiles.length > 0 && !hasSpeciesOnTile(this.selectedTiles[0]);
      case ActionName.Blight:
        if (this.selectedTiles.length === 0) {
          return false;
        }
        const adjacentElements = this.elements.filter(element => isCornerAdjacent(element.coords, this.selectedTiles[0].coords));
        return this.selectedElements.length === Math.max(0, adjacentElements.length - 1)
          && this.selectedElements.every(selectedElement => adjacentElements.includes(selectedElement));
      default:
        return false;
    }
  }

  get canReset(): boolean {
    switch (this.selectedAction) {
      case ActionName.Catastrophe:
      case ActionName.MassExodus:
      case ActionName.Blight:
      case ActionName.Hibernation:
        return this.selectedTiles.length > 0;
      case ActionName.Predator:
      case ActionName.Biomass:
      case ActionName.Fecundity:
        return this.tiles.some(tile => hasDeltas(tile));
      default:
        return this.canConfirm;
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
            element: this.selectedElements.length > 0 ? this.selectedElements[0].element.corner : null,
            tiles: speciatedTiles.map(tile => tile.tile.hex),
            species: speciatedTiles.map(tile => tile.deltas[this.state.currentAnimal].added)
          }
        });
        break;

      case ActionName.Hibernation:
        this.perform.emit({
          [this.selectedAction]: {
            tile: this.selectedTiles[0].tile.hex,
            species: this.selectedTiles[0].deltas[this.state.currentAnimal]?.added || 0
          }
        });
        break;

      case ActionName.Aquatic:
        const tile = this.tiles.find(tile => tile.deltas[this.state.currentAnimal]?.added > 0);

        this.perform.emit({
          [this.selectedAction]: {
            elementType: this.selectedElementTypes[0],
            corner: coordsToCorner(this.selectedCorner),
            tile: tile?.tile.hex,
            species: tile?.deltas[this.state.currentAnimal].added
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
      case ActionName.Evolution:
        this.perform.emit({
          [this.selectedAction]: {
            tiles: this.selectedTiles.map(tile => tile.tile.hex),
            animals: this.selectedAnimalTypes
          }
        });
        break;

      case ActionName.Catastrophe:
        const selectedTile = this.selectedTiles[0];
        const adjacentTiles = this.tiles.filter(tile => isAdjacent(tile.coords, selectedTile.coords));
        this.perform.emit({
          [this.selectedAction]: {
            tile: selectedTile.tile.hex,
            keep: Object.keys(selectedTile.species).find(at => selectedTile.species[at] === 1),
            adjacentTiles: adjacentTiles.map(adjacent => adjacent.tile.hex),
            animals: adjacentTiles.map(adjacent => Object.keys(adjacent.deltas).find(at => adjacent.deltas[at]?.removed === 1))
          }
        });
        break;

      case ActionName.MassExodus:
        this.perform.emit({
          [this.selectedAction]: {
            from: this.selectedTiles[0].tile.hex,
            moves: this.moves.map(move => ({
              to: move.to.tile.hex,
              animal: move.animalType,
              species: move.species
            }))
          }
        });
        break;

      case ActionName.Blight:
        this.perform.emit({
          [this.selectedAction]: {
            tile: this.selectedTiles[0].tile.hex,
            elements: this.selectedElements.map(elem => elem.element.corner)
          }
        });
        break;

      case ActionName.Predator:
        const predatorTiles = this.tiles.filter(tile => this.hasSpeciesOnTile(tile)
          && Object.keys(tile.deltas)
            .filter(at => this.isOpposing(at as AnimalType))
            .some(at => tile.deltas[at]?.removed > 0));
        this.perform.emit({
          [this.selectedAction]: {
            tiles: predatorTiles.map(tile => tile.tile.hex),
            animals: predatorTiles.map(tile => Object.keys(tile.deltas).find(at => tile.deltas[at]?.removed > 0))
          }
        });
        break;

      case ActionName.Biomass:
        const biomassTiles = this.tiles
          .filter(tile => getTotalSpecies(tile) > this.getAdjacentElements(tile).length)
          .filter(tile => hasDeltas(tile));
        this.perform.emit({
          [this.selectedAction]: {
            tiles: biomassTiles.map(tile => tile.tile.hex),
            animals: biomassTiles.map(tile => Object.keys(tile.deltas).find(at => tile.deltas[at]?.removed > 0))
          }
        });
        break;

      case ActionName.Fecundity:
        this.perform.emit({
          [this.selectedAction]: {
            tiles: this.tiles.filter(tile => tile.deltas[this.state.currentAnimal]?.added > 0).map(tile => tile.tile.hex)
          }
        });
        break;

      default:
        throw new Error('Don\'t know how to confirm action: ' + this.selectedAction);
    }
  }

  reset() {
    this.selectedElementTypes = [];
    this.selectedElements = [];
    this.selectedCorner = null;
    this.selectedTiles = [];
    this.selectedAnimalTypes = [];
    this.selectedWanderlustTile = null;
    this.addedTiles = [];
    this.moves = [];
    this.tiles = this.calculateTiles();
    this.elements = this.calculateElements();
    this.selectableCorners = this.canSelectCorner ? this.calculateSelectableCorners() : [];
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
      case ActionName.Fertile:
        this.perform.emit({
          [this.selectedAction]: {
            tile: tile.tile.hex
          }
        });
        break;

      case ActionName.Speciation:
        this.speciation(tile);
        break;

      case ActionName.Fecundity:
        this.resetChangedSpecies(tile);
        this.changeSpecies(tile, this.state.currentAnimal, 1);
        break;

      case ActionName.Hibernation:
        if (this.selectedTiles.length === 0 || this.selectedTiles.includes(tile)) {
          this.selectedTiles = [tile];
          const currentDelta = tile.deltas[this.state.currentAnimal]?.added || 0;
          if (currentDelta < 5) {
            this.changeSpecies(tile, this.state.currentAnimal, 1);
          }
        }
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

      case ActionName.Catastrophe:
        if (this.selectedTiles.length === 0) {
          this.selectedTiles.push(tile);

          // Auto select species if possible
          const animalsWithSpecies = Object.keys(tile.species)
            .map(at => at as AnimalType)
            .filter(at => tile.species[at] > 0);
          if (animalsWithSpecies.length === 1) {
            this.selectSpecies(tile, animalsWithSpecies[0]);
          }

          this.tiles
            .filter(t => isAdjacent(tile.coords, t.coords))
            .forEach(adjacent => {
              // Auto select on adjacent if possible
              const animalsWithSpecies = Object.keys(adjacent.tile.species)
                .map(at => at as AnimalType)
                .filter(at => adjacent.tile.species[at] > 0);
              if (animalsWithSpecies.length === 1) {
                this.selectSpecies(adjacent, animalsWithSpecies[0]);
              }
            });
        }
        break;

      case ActionName.MassExodus:
        if (this.selectedTiles.length === 0) {
          this.selectedTiles.push(tile);

          // Auto select species if possible
          const animalsWithSpecies = Object.keys(tile.species)
            .map(at => at as AnimalType)
            .filter(at => tile.species[at] > 0);
          if (animalsWithSpecies.length === 1) {
            this.selectSpecies(tile, animalsWithSpecies[0]);
          }
        } else if (isAdjacent(tile.coords, this.selectedTiles[0].coords)) {
          // adjacent
          if (this.selectedAnimalTypes.length > 0) {
            this.move(this.selectedTiles[0], tile, this.selectedAnimalTypes[0], 1);
          }
        }
        break;

      case ActionName.Blight:
        if (this.selectedTiles.length > 0) {
          this.selectedElements = this.selectedElements
            .filter(selectedElement => isCornerAdjacent(selectedElement.coords, tile.coords));
        }
        this.selectedTiles = [tile];
        break;

      case ActionName.SaveFromExtinction:
        this.perform.emit({
          [this.selectedAction]: {
            tile: tile.tile.hex
          }
        });
        break;
    }
  }

  private migration(to: TileItem) {
    this.move(this.selectedTiles[0], to, this.state.currentAnimal, 1);

    if (!this.hasPreExistingSpeciesLeftOnTile(this.selectedTiles[0])
      || !this.hasNotReachedMaxSpeciesToMigrate()
      || !this.tiles.some(tile => this.canMigrateSpeciesTo(tile))) {
      this.selectedTiles = [];
    }
  }

  private wanderlustMove(from: TileItem) {
    const to = this.tiles.find(other => other.tile.hex === this.state.lastPlacedTile);
    this.move(from, to, this.state.currentAnimal, 1);
  }

  private move(from: TileItem, to: TileItem, animalType: AnimalType, amount: number) {
    this.changeSpecies(from, animalType, -amount);
    this.changeSpecies(to, animalType, amount);
    this.addOrMergeMove(from, to, animalType, amount);
  }

  private aquatic(tile: TileItem) {
    if (this.selectedTiles.length > 0 && this.selectedTiles[0] !== tile) {
      this.resetChangedSpecies(this.selectedTiles[0]);
    }
    this.selectedTiles = [tile];

    const currentDelta = tile.deltas[this.state.currentAnimal]?.added || 0;
    if (currentDelta < 4) {
      this.changeSpecies(tile, this.state.currentAnimal, 1);
    } else {
      this.resetChangedSpecies(tile);
    }
  }

  private speciation(tile: TileItem) {
    const currentDelta = tile.deltas[this.state.currentAnimal]?.added || 0;
    const maxSpeciation = getMaxSpeciation(tile.tile);
    if (currentDelta < maxSpeciation) {
      this.changeSpecies(tile, this.state.currentAnimal, 1);
    } else {
      this.resetChangedSpecies(tile);
    }
  }

  private changeSpecies(tile: TileItem, animalType: AnimalType, amount: number = 1) {
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

    tile.cubes = this.calculateCubes(tile.species, tile.deltas);
  }

  private resetChangedSpecies(tile: TileItem) {
    // tile.species[this.state.currentAnimal] = tile.tile.species[this.state.currentAnimal] || 0;
    // if (tile.species[this.state.currentAnimal] === 0) {
    //   delete tile.species[this.state.currentAnimal];
    // }
    // delete tile.deltas[this.state.currentAnimal];

    tile.species = Object.assign({}, tile.tile.species);
    tile.deltas = {};
    tile.cubes = this.calculateCubes(tile.species, tile.deltas);
  }

  canSelectTile(tile: TileItem): boolean {
    switch (this.selectedAction) {
      case ActionName.Speciation:
        return this.selectedElements.length > 0 && isCornerAdjacent(this.selectedElements[0].coords, tile.coords);
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
        return this.selectedElementTypes.length > 0
          && this.selectedCorner && isCornerAdjacent(this.selectedCorner, tile.coords)
          && [TileType.SEA, TileType.WETLAND].includes(tile.tile.type);
      case ActionName.Catastrophe:
        return this.selectedTiles.length === 0;
      case ActionName.Hibernation:
        return this.selectedTiles.length === 0 || this.selectedTiles.includes(tile);
      case ActionName.MassExodus:
        return this.selectedTiles.length === 0
          || (this.selectedAnimalTypes.length > 0 && isAdjacent(tile.coords, this.selectedTiles[0].coords)
            && this.hasPreExistingSpeciesLeftOnTile(this.selectedTiles[0], this.selectedAnimalTypes[0]));
      case ActionName.Blight:
        return true;
      case ActionName.SaveFromExtinction:
        return this.hasEndangeredSpeciesOnTile(tile, AnimalType.MAMMALS);
      case ActionName.Fecundity:
      case ActionName.Fertile:
        return this.hasSpeciesOnTile(tile) && !hasDeltas(tile);
      default:
        return false;
    }
  }

  get canSelectElementTypeFromDrawBag(): boolean {
    return [ActionName.Aquatic, ActionName.Habitat].includes(this.selectedAction);
  }

  private hasPreExistingSpeciesLeftOnTile(tile: TileItem, animalType: AnimalType = this.state.currentAnimal) {
    const preExistingSpecies = tile.tile.species[animalType] || 0;
    const removed = tile.deltas[animalType]?.removed || 0;
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

    switch (this.selectedAction) {
      case ActionName.Aquatic:
        this.elements.push({
          element: {
            corner: coordsToCorner(corner),
            type: this.selectedElementTypes[0]
          },
          coords: corner,
          center: this.layout.intersection(corner.a, corner.b, corner.c)
        });
        break;

      default:
        this.performOnceEverythingSelected();
    }
  }

  canSelectElement(element: ElementItem): boolean {
    switch (this.selectedAction) {
      case ActionName.Depletion:
        return this.state.actionDisplay.elements[ActionType.DEPLETION].includes(element.element.type);
      case ActionName.Speciation:
        const speciationElementType = this.getSpeciationElementType();
        return element.element.type === speciationElementType && this.isNotInsectsFreeAction();
      case ActionName.Blight:
        return this.selectedTiles.length > 0 && isCornerAdjacent(element.coords, this.selectedTiles[0].coords)
          && this.selectedElements.length < this.getAdjacentElements(this.selectedTiles[0]).length - 1;
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

        this.selectedElements = [element];

        const noLongerSelectableTiles = previousSelectableTiles.filter(tile => !this.canSelectTile(tile));
        noLongerSelectableTiles.forEach(tile => {
          // Reset any deltas
          tile.species = Object.assign({}, tile.tile.species);
          tile.deltas = {} as any;
          tile.cubes = this.calculateCubes(tile.species, {});
        })
        break;

      case ActionName.Blight:
        if (this.selectedElements.includes(element)) {
          const index = this.selectedElements.indexOf(element);
          this.selectedElements.splice(index, 1);
        } else {
          this.selectedElements.push(element);
        }

        if (this.selectedTiles.length > 0) {
          if (!isCornerAdjacent(element.coords, this.selectedTiles[0].coords)) {
            this.selectedTiles = [];
          }
        }

        if (this.selectedTiles.length === 0) {
          // Auto select tile if possible
          const adjacentTiles = this.tiles
            .filter(tile => isCornerAdjacent(element.coords, tile.coords))
            .filter(tile => {
              const adjacentElements = this.elements.filter(elem => isCornerAdjacent(elem.coords, tile.coords));
              return this.selectedElements.length === Math.max(0, adjacentElements.length - 1)
                && this.selectedElements.every(elem => adjacentElements.includes(elem));
            });
          if (adjacentTiles.length === 1) {
            this.selectedTiles = [adjacentTiles[0]];
          }
        }

        break;
    }
  }

  isElementSelected(element: ElementItem): boolean {
    return this.selectedElements.includes(element);
  }

  selectElementType(elementType: ElementType) {
    console.debug('selectElementType:', elementType);

    if (this.selectedAction === ActionName.Regression) {
      if (this.selectedElementTypes.includes(elementType)) {
        const index = this.selectedElementTypes.indexOf(elementType);
        this.selectedElementTypes.splice(index, 1);
      } else {
        this.selectedElementTypes.push(elementType);
      }
    } else {
      this.selectedElementTypes = [elementType];
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
      case ActionName.Aquatic:
      case ActionName.Habitat:
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
      case ActionName.Habitat:
        return this.calculateEmptyCornersOnTiles(this.state.tiles);
      case ActionName.Aquatic:
        return this.calculateEmptyCornersOnTiles(this.state.tiles
          .filter(tile => [TileType.WETLAND, TileType.SEA].includes(tile.type)));
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

  private calculateEmptyCornersOnTiles(tiles: Tile[]) {
    return tiles // start from the existing tiles so we at least have an adjacent tile (reduces search space)
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
      case ActionName.Habitat:
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

  private addOrMergeMove(from: TileItem, to: TileItem, animalType: AnimalType, species: number) {
    const existing = this.moves.find(move => move.from === from && move.to === to);

    if (existing) {
      existing.species += species;
    } else {
      const text: XYCoords = {
        x: from.hex.center.x + (to.hex.center.x - from.hex.center.x) / 2,
        y: from.hex.center.y + (to.hex.center.y - from.hex.center.y) / 2
      };

      this.moves.push({from, to, center: text, animalType, species});
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
      case ActionName.Evolution:
        return animalType !== this.state.currentAnimal && tile.species[animalType] > 0 && !this.selectedAnimalTypes.includes(animalType);
      case ActionName.Catastrophe:
        return this.selectedTiles.length > 0
          && (this.selectedTiles.includes(tile) || isAdjacent(tile.coords, this.selectedTiles[0].coords))
          && !hasDeltas(tile);
      case ActionName.MassExodus:
        return this.selectedTiles.length === 0 || this.selectedTiles.includes(tile);
      case ActionName.Predator:
        return this.hasSpeciesOnTile(tile) && this.isOpposing(animalType) && !tile.deltas[animalType]?.removed;
      case ActionName.Biomass:
        return !hasDeltas(tile) && getTotalSpecies(tile) > this.getAdjacentElements(tile).length;
      default:
        return false;
    }
  }

  private hasSpeciesOnTile(tile: TileItem) {
    return tile.tile.species[this.state.currentAnimal] > 0;
  }

  private isOpposing(animalType: AnimalType) {
    return animalType != this.state.currentAnimal;
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
        break;

      case ActionName.Evolution:
        this.selectedTiles.push(tile);
        this.selectedAnimalTypes.push(animalType);
        break;

      case ActionName.Catastrophe:
        if (tile === this.selectedTiles[0]) {
          // Eliminate all but 1 of the selected species
          if (tile.tile.species[animalType] > 1) {
            this.changeSpecies(tile, animalType, -(tile.tile.species[animalType] - 1));
          }

          // Eliminate all other species
          const otherAnimalsWithSpeciesOnTile = Object.keys(tile.tile.species)
            .map(at => at as AnimalType)
            .filter(at => at !== animalType)
            .filter(at => tile.tile.species[at] > 0);
          for (const otherAnimalType of otherAnimalsWithSpeciesOnTile) {
            this.changeSpecies(tile, otherAnimalType, -tile.tile.species[otherAnimalType]);
          }
        } else {
          // Adjacent tile
          this.changeSpecies(tile, animalType, -1);
        }
        break;

      case ActionName.MassExodus:
        if (this.selectedTiles.length === 0) {
          this.selectedTiles.push(tile);
        }
        if (this.selectedTiles[0] === tile) {
          this.selectedAnimalTypes = [animalType];
        }
        break;

      case ActionName.Predator:
      case ActionName.Biomass:
        this.resetChangedSpecies(tile);
        this.changeSpecies(tile, animalType, -1);
        break;
    }
  }

  isSpeciesSelected(tile: TileItem, animalType: AnimalType): boolean {
    const index = this.selectedTiles.indexOf(tile);
    return index >= 0 && this.selectedAnimalTypes[index] === animalType;
  }

  get canSelectCard(): boolean {
    return this.selectedAction === ActionName.DominanceCard;
  }

  selectCard(card: Card) {
    if (!this.canSelectCard) {
      return;
    }

    this.perform.emit({
      [this.selectedAction]: {
        card
      }
    });
  }

  private hasEndangeredSpeciesOnTile(tile: TileItem, animalType: AnimalType) {
    if ((tile.tile.species[animalType] || 0) <= 0) {
      return false;
    }

    const matchingElements = this.matchElements(tile, this.state.animals[animalType]);

    return matchingElements === 0;
  }

  private matchElements(tile: TileItem, animal: Animal) {
    const adjacentElements = this.elements.filter(e => isCornerAdjacent(e.coords, tile.coords));

    const matchingElements = animal.elements.map(elementOnAnimal => adjacentElements
      .filter(adjacentElement => adjacentElement.element.type === elementOnAnimal)
      .length)
      .reduce((a, b) => a + b, 0);

    return matchingElements;
  }

  private getAdjacentElements(tile: TileItem): ElementItem[] {
    return this.elements.filter(e => isCornerAdjacent(e.coords, tile.coords));
  }

  selectAction(action: ActionName) {
    if (DIRECT_ACTIONS.includes(action)) {
      this.perform.emit({
        [action]: {}
      });
    } else {
      this.selectedAction = action;
    }
  }
}


