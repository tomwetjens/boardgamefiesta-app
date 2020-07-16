import {Component, Input, OnInit} from '@angular/core';
import {Player, Table, TablePlayer} from '../model';

@Component({
  selector: 'app-in-game-player',
  templateUrl: './in-game-player.component.html',
  styleUrls: ['./in-game-player.component.scss']
})
export class InGamePlayerComponent implements OnInit {

  @Input() table: Table;
  @Input() player: TablePlayer;

  @Input() score?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
