import {Component, Input, OnInit} from '@angular/core';
import {Player, TablePlayer} from "../../shared/model";
import {PlayerState} from "../model";

@Component({
  selector: 'app-assistant-popover',
  templateUrl: './assistant-popover.component.html',
  styleUrls: ['./assistant-popover.component.scss']
})
export class AssistantPopoverComponent implements OnInit {

  @Input() player: TablePlayer;
  @Input() playerState: PlayerState;

  constructor() { }

  ngOnInit(): void {
  }

}
