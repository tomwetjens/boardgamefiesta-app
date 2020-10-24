import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Building, Location, Trail} from "../model";
import {Table} from "../../shared/model";

@Component({
  selector: 'gwt-location-popover',
  templateUrl: './location-popover.component.html',
  styleUrls: ['./location-popover.component.scss']
})
export class LocationPopoverComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() trail: Trail;
  @Input() name: string;
  @Input() risk = false;

  location?: Location;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.trail && this.name) {
      this.location = this.trail.locations[this.name];
    }
  }

}
