import {Component, Input, OnInit} from '@angular/core';
import {Hazard} from "../model";

@Component({
  selector: 'gwt-hazard-popover',
  templateUrl: './hazard-popover.component.html',
  styleUrls: ['./hazard-popover.component.scss']
})
export class HazardPopoverComponent implements OnInit {

  @Input() hazard: Hazard;

  constructor() { }

  ngOnInit(): void {
  }

}
