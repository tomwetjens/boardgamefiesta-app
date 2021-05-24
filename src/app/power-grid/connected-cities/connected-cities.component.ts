import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {PowerGrid} from "../model";
import {Table} from "../../shared/model";

function frequency<T>(array: T[]): Map<T, number> {
  return array.reduce((counts, elem) => {
    counts.set(elem, (counts.get(elem) || 0) + 1);
    return counts;
  }, new Map<T, number>());
}

@Component({
  selector: 'power-grid-connected-cities',
  templateUrl: './connected-cities.component.html',
  styleUrls: ['./connected-cities.component.scss']
})
export class ConnectedCitiesComponent implements OnInit, OnChanges {

  @Input() state: PowerGrid;
  @Input() table: Table;

  connected: Map<string, number>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.connected = frequency(
      Array.prototype.concat.apply(this.state.playerOrder, Object.keys(this.state.cities)
        .flatMap(city => this.state.cities[city])));
  }

}
