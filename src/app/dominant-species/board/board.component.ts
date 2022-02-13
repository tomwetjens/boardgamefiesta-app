import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {AxialHexagonalGrid, FlatAxialLayout, Hexagon, HexagonalCoordinates, XYCoords} from '../hexagon';
import {Action, ActionName, DominantSpecies, Element, HEXES, Tile} from '../model';
import {PanZoomConfig} from 'ngx-panzoom';
import {Table} from "../../shared/model";

interface HexItem {
  coords: HexagonalCoordinates;
  hex: Hexagon;
}

interface TileItem {
  tile: Tile;
  hex: Hexagon;
}

interface ElementItem {
  element: Element;
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

  @Output() perform = new EventEmitter<Action>();

  grid = new AxialHexagonalGrid();
  layout = new FlatAxialLayout(100);

  hexes: HexItem[] = HEXES
    .map(coords => ({
      coords,
      hex: this.layout.render(coords)
    }));

  tiles: TileItem[];

  elements: ElementItem[];

  panZoomConfig: PanZoomConfig = new PanZoomConfig({
    keepInBounds: true,
    freeMouseWheel: true,
    freeMouseWheelFactor: 0.001,
    panOnClickDrag: true
  });

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.tiles = this.state.tiles
      .map(tile => ({
        hex: this.layout.render(tile.hex),
        tile
      }));

    this.elements = this.state.elements
      .map(element => {
        return {
          center: this.layout.intersection(element.corner.a, element.corner.b, element.corner.c),
          element
        };
      });
  }

  selectHexagon(coords: HexagonalCoordinates) {
    console.debug('selectHexagon:', coords);
  }

  selectTile(tile: Tile) {
    console.debug('selectTile:', tile);
  }

}
