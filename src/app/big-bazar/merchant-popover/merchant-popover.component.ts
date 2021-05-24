import {Component, Input, OnInit} from '@angular/core';
import {PlayerColor, TablePlayer} from "../../shared/model";
import {PlayerState} from "../model";

@Component({
  selector: 'app-merchant-popover',
  templateUrl: './merchant-popover.component.html',
  styleUrls: ['./merchant-popover.component.scss']
})
export class MerchantPopoverComponent implements OnInit {

  @Input() playerColor: PlayerColor;
  @Input() player: TablePlayer;
  @Input() playerState: PlayerState;

  constructor() { }

  ngOnInit(): void {
  }

}
