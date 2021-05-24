import {Component, Input, OnInit} from '@angular/core';
import {TablePlayer} from "../../shared/model";

@Component({
  selector: 'power-grid-player-house',
  templateUrl: './player-house.component.html',
  styleUrls: ['./player-house.component.scss']
})
export class PlayerHouseComponent implements OnInit {

  @Input() player: TablePlayer;

  constructor() { }

  ngOnInit(): void {
  }

}
