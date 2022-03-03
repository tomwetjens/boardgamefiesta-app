import {Component, Input, OnInit} from '@angular/core';
import {DrawBag} from "../model";

@Component({
  selector: 'ds-draw-bag',
  templateUrl: './draw-bag.component.html',
  styleUrls: ['./draw-bag.component.scss']
})
export class DrawBagComponent implements OnInit {

  @Input() drawBag: DrawBag;

  constructor() { }

  ngOnInit(): void {
  }

}
