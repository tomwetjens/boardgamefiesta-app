import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ElementType} from "../model";

@Component({
  selector: 'ds-element-space',
  templateUrl: './element-space.component.html',
  styleUrls: ['./element-space.component.scss']
})
export class ElementSpaceComponent implements OnInit {

  @Input() selectable: boolean;
  @Input() selected: boolean;
  @Input() element: ElementType;

  @Output() selectElement = new EventEmitter<ElementType>();

  constructor() { }

  ngOnInit(): void {
  }

}
