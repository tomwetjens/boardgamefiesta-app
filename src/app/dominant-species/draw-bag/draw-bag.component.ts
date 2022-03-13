import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DrawBag, ElementType} from "../model";

@Component({
  selector: 'ds-draw-bag',
  templateUrl: './draw-bag.component.html',
  styleUrls: ['./draw-bag.component.scss']
})
export class DrawBagComponent implements OnInit {

  @Input() drawBag: DrawBag;
  @Input() selectable: boolean;
  @Input() selectedElementTypes: ElementType[];
  @Output() selectElementType = new EventEmitter<ElementType>();

  elementTypes = [ElementType.GRASS, ElementType.GRUB, ElementType.SUN, ElementType.MEAT, ElementType.WATER, ElementType.SEED];

  constructor() { }

  ngOnInit(): void {
  }

}
