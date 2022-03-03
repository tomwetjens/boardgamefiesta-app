import {Component, Input, OnInit} from '@angular/core';
import {Animal} from "../model";
import {TablePlayer} from "../../shared/model";

@Component({
  selector: 'ds-action-pawn',
  templateUrl: './action-pawn.component.html',
  styleUrls: ['./action-pawn.component.scss']
})
export class ActionPawnComponent implements OnInit {

  @Input() animal: Animal;
  @Input() player: TablePlayer;

  constructor() { }

  ngOnInit(): void {
  }

}
