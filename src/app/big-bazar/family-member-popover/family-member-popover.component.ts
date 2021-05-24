import {Component, Input, OnInit} from '@angular/core';
import {PlayerState} from "../model";
import {TablePlayer} from "../../shared/model";

@Component({
  selector: 'app-family-member-popover',
  templateUrl: './family-member-popover.component.html',
  styleUrls: ['./family-member-popover.component.scss']
})
export class FamilyMemberPopoverComponent implements OnInit {

  @Input() player: TablePlayer;
  @Input() playerState: PlayerState;

  constructor() {
  }

  ngOnInit(): void {
  }

}
