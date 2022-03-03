import {Component, Input, OnInit} from '@angular/core';
import {Table, TablePlayer} from "../../shared/model";
import {Animal, DominantSpecies} from "../model";

@Component({
  selector: 'ds-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {

  @Input() player: TablePlayer;
  @Input() table: Table;
  @Input() state: DominantSpecies;
  @Input() animal: Animal;

  constructor() {
  }

  ngOnInit(): void {
  }

}
