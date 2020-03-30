import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Action, Game} from '../model';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  @Input()
  game: Game;

  @Output() action = new EventEmitter<Action>();
  @Output() endTurn = new EventEmitter<Action>();

  constructor() { }

  ngOnInit(): void {
  }

}
