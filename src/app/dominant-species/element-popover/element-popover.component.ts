import {Component, Input, OnInit} from '@angular/core';
import {ElementType} from "../model";

@Component({
  selector: 'ds-element-popover',
  templateUrl: './element-popover.component.html',
  styleUrls: ['./element-popover.component.scss']
})
export class ElementPopoverComponent implements OnInit {

  @Input() elementType: ElementType;

  constructor() { }

  ngOnInit(): void {
  }

}
