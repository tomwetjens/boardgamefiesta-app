import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'ds-tundra-tiles',
  templateUrl: './tundra-tiles.component.html',
  styleUrls: ['./tundra-tiles.component.scss']
})
export class TundraTilesComponent implements OnInit {

  @Input() availableTundraTiles: number;

  constructor() { }

  ngOnInit(): void {
  }

}
