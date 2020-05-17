import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {TablePlayer} from "../model";

@Component({
  selector: 'app-player-name',
  templateUrl: './player-name.component.html',
  styleUrls: ['./player-name.component.scss']
})
export class PlayerNameComponent implements OnInit {

  @Input() player: TablePlayer;

  constructor() { }

  ngOnInit(): void {
  }

  @HostBinding('class')
  get className(): string {
    return this.player.color.toString();
  }

}
