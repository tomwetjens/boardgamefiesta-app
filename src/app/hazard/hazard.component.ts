import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {Hazard} from '../model';

@Component({
  selector: 'app-hazard',
  templateUrl: './hazard.component.html',
  styleUrls: ['./hazard.component.scss']
})
export class HazardComponent implements OnInit {

  @Input() hazard: Hazard;

  constructor() { }

  ngOnInit(): void {
  }

  @HostBinding('class')
  get className(): string {
    // TODO points
    return this.hazard.type.toString() + ' ' + this.hazard.hands.toString();
  }

}
