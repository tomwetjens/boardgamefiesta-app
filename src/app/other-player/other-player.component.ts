import {Component, Input, OnInit} from '@angular/core';
import {PlayerState} from '../model';

@Component({
  selector: 'app-other-player',
  templateUrl: './other-player.component.html',
  styleUrls: ['./other-player.component.scss']
})
export class OtherPlayerComponent implements OnInit {

  @Input() playerState: PlayerState;

  constructor() { }

  ngOnInit(): void {
  }

}
