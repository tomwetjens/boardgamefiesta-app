import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'power-grid-elektro',
  templateUrl: './elektro.component.html',
  styleUrls: ['./elektro.component.scss']
})
export class ElektroComponent implements OnInit {

  @Input() value: number;

  constructor() { }

  ngOnInit(): void {
  }

}
