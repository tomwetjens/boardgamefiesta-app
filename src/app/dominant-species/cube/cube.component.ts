import {Component, Input, OnInit} from '@angular/core';
import {Animal} from "../model";

@Component({
  selector: 'ds-cube',
  templateUrl: './cube.component.html',
  styleUrls: ['./cube.component.scss']
})
export class CubeComponent implements OnInit {

  @Input() animal: Animal;

  constructor() { }

  ngOnInit(): void {
  }

}
