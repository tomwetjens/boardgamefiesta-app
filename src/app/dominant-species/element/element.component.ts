import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ElementType} from "../model";

@Component({
  selector: 'ds-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss']
})
export class ElementComponent implements OnInit {

  @Input() selectable: boolean;
  @Input() selected: boolean;
  @Input() elementType: ElementType;

  @Output() selectElement = new EventEmitter<ElementType>();

  constructor() { }

  ngOnInit(): void {
  }

}
