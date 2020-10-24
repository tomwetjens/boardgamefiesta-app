import {Component, Input, OnInit} from '@angular/core';
import {PlayerColor} from "../../shared/model";

@Component({
  selector: 'gwt-building-popover',
  templateUrl: './building-popover.component.html',
  styleUrls: ['./building-popover.component.scss']
})
export class BuildingPopoverComponent implements OnInit {

  @Input() building: string;
  @Input() color?: PlayerColor;

  constructor() {
  }

  ngOnInit(): void {
  }

}
