import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ElementType, TileStack, WanderlustTiles} from "../model";

@Component({
  selector: 'ds-wanderlust-tiles',
  templateUrl: './wanderlust-tiles.component.html',
  styleUrls: ['./wanderlust-tiles.component.scss']
})
export class WanderlustTilesComponent implements OnInit {

  @Input() wanderlustTiles: WanderlustTiles;
  @Input() selectable: boolean;
  @Input() selectedStack: number;
  @Output() selectWanderlustTile = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void {
  }

}
