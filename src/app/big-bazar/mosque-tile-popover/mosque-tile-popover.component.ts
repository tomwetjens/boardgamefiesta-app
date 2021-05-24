import {Component, Input, OnInit} from '@angular/core';
import {MosqueTile} from "../model";

@Component({
  selector: 'app-mosque-tile-popover',
  templateUrl: './mosque-tile-popover.component.html',
  styleUrls: ['./mosque-tile-popover.component.scss']
})
export class MosqueTilePopoverComponent implements OnInit {

  @Input() mosqueTile: MosqueTile;

  constructor() { }

  ngOnInit(): void {
  }

}
