import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {MosqueTile} from "../model";

@Component({
  selector: 'big-bazar-mosque-tile',
  templateUrl: './mosque-tile.component.html',
  styleUrls: ['./mosque-tile.component.scss']
})
export class MosqueTileComponent implements OnInit {

  @Input() mosqueTile: MosqueTile;

  constructor() { }

  ngOnInit(): void {
  }

  @HostBinding('class')
  get hostClass(): string {
    return this.mosqueTile.toString();
  }

}
