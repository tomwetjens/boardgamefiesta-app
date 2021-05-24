import {Component, Input, OnInit} from '@angular/core';
import {Table} from "../../shared/model";

@Component({
  selector: 'power-grid-player-order',
  templateUrl: './player-order.component.html',
  styleUrls: ['./player-order.component.scss']
})
export class PlayerOrderComponent implements OnInit {

  @Input() playerOrder: string[];
  @Input() table: Table;

  constructor() {
  }

  ngOnInit(): void {
  }

}
