import {Component, Input, OnInit} from '@angular/core';
import {TileType} from "../model";

@Component({
  selector: 'ds-tile-popover',
  templateUrl: './tile-popover.component.html',
  styleUrls: ['./tile-popover.component.scss']
})
export class TilePopoverComponent implements OnInit {

  @Input() tileType: TileType;

  constructor() { }

  ngOnInit(): void {
  }

}
