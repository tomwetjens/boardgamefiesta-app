import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Building, Trail} from "../model";
import {Table} from "../../shared/model";

@Component({
  selector: 'gwt-location-popover',
  templateUrl: './location-popover.component.html',
  styleUrls: ['./location-popover.component.scss']
})
export class LocationPopoverComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() trail: Trail;
  @Input() location: string;
  @Input() risk = false;

  building?: Building;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.trail && this.location) {
      const loc = this.trail.locations[this.location];
      this.building = loc ? loc.building : undefined;
    }
  }

}
