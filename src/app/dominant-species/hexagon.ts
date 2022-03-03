export interface HexagonalCoordinates {
}

export interface XYCoords {
  x: number;
  y: number;
}

export interface AxialCoordinates extends HexagonalCoordinates {
  q: number;
  r: number;
}

export interface AxialCorner {
  a: AxialCoordinates;
  b: AxialCoordinates;
  c: AxialCoordinates;
}

export function distance(a: AxialCoordinates, b: AxialCoordinates): number {
  return (Math.abs(a.q - b.q)
    + Math.abs(a.q + a.r - b.q - b.r)
    + Math.abs(a.r - b.r)) / 2;
}

export function isAdjacent(a: AxialCoordinates, b: AxialCoordinates): boolean {
  return distance(a, b) === 1;
}

export function cornersEqual(corner1: AxialCorner, corner2: AxialCorner): boolean {
  return (coordsEqual(corner1.a, corner2.a) && coordsEqual(corner1.b, corner2.b) && coordsEqual(corner1.c, corner2.c))
    || (coordsEqual(corner1.a, corner2.a) && coordsEqual(corner1.b, corner2.c) && coordsEqual(corner1.c, corner2.b))
    || (coordsEqual(corner1.a, corner2.b) && coordsEqual(corner1.b, corner2.a) && coordsEqual(corner1.c, corner2.c))
    || (coordsEqual(corner1.a, corner2.b) && coordsEqual(corner1.b, corner2.c) && coordsEqual(corner1.c, corner2.a))
    || (coordsEqual(corner1.a, corner2.c) && coordsEqual(corner1.b, corner2.a) && coordsEqual(corner1.c, corner2.b))
    || (coordsEqual(corner1.a, corner2.c) && coordsEqual(corner1.b, corner2.b) && coordsEqual(corner1.c, corner2.a));
}

export function isCornerAdjacent(corner: AxialCorner, coords: AxialCoordinates) {
  return coordsEqual(corner.a, coords) || coordsEqual(corner.b, coords) || coordsEqual(corner.c, coords);
}

export function coordsEqual(a: AxialCoordinates, b: AxialCoordinates): boolean {
  return a.q === b.q && a.r === b.r;
}

interface HexagonLayout<T extends HexagonalCoordinates> {

  center(coords: T): XYCoords;

  intersection(a: T, b: T, c: T): XYCoords;

  render(coords: AxialCoordinates): Hexagon;

}

export interface Hexagon {
  center: XYCoords;
  points: string;
}

/**
 * Layout that takes axial coordinates and calculates flat top hexagons.
 * https://www.redblobgames.com/grids/hexagons/#coordinates
 */
export class FlatAxialLayout implements HexagonLayout<AxialCoordinates> {

  private width: number;
  private height: number;

  constructor(public size: number) {
    this.width = 2 * this.size;
    this.height = Math.sqrt(3) * this.size;
  }

  intersection(a: AxialCoordinates, b: AxialCoordinates, c: AxialCoordinates): XYCoords {
    const ca = this.center(a), cb = this.center(b), cc = this.center(c);
    return {
      x: (ca.x + cb.x + cc.x) / 3,
      y: (ca.y + cb.y + cc.y) / 3
    }
  }

  center(coords: AxialCoordinates): XYCoords {
    return {
      x: this.size * 1.5 * coords.q,
      y: this.size * (Math.sqrt(3) / 2 * coords.q + Math.sqrt(3) * coords.r)
    };
  }

  render(coords: AxialCoordinates): Hexagon {
    return {
      center: this.center(coords),
      points:
        (-0.25 * this.width) + ',' + (-0.50 * this.height) + ' ' +
        (0.25 * this.width) + ',' + (-0.50 * this.height) + ' ' +
        (0.50 * this.width) + ',0 ' +
        (0.25 * this.width) + ',' + (0.50 * this.height) + ' ' +
        (-0.25 * this.width) + ',' + (0.50 * this.height) + ' ' +
        (-0.50 * this.width) + ',0'
    };
  }

}

export interface HexagonalGrid<T extends HexagonalCoordinates> {

  neighbors(coords: AxialCoordinates): AxialCoordinates[];

}

export class AxialHexagonalGrid implements HexagonalGrid<AxialCoordinates> {

  neighbors(coords: AxialCoordinates): AxialCoordinates[] {
    return [
      {q: coords.q + 1, r: coords.r},
      {q: coords.q + -1, r: coords.r},
      {q: coords.q + 1, r: coords.r - 1},
      {q: coords.q - 1, r: coords.r + 1},
      {q: coords.q, r: coords.r - 1},
      {q: coords.q, r: coords.r + 1}
    ];
  }

}
