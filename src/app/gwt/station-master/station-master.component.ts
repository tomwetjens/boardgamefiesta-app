import {Component, HostBinding, Input, OnInit} from '@angular/core';
import {StationMaster} from '../model';

@Component({
  selector: 'app-station-master',
  templateUrl: './station-master.component.html',
  styleUrls: ['./station-master.component.scss']
})
export class StationMasterComponent implements OnInit {

  @Input() stationMaster: StationMaster;

  constructor() {
  }

  ngOnInit(): void {
  }

  @HostBinding('class')
  get className(): string {
    return this.stationMaster.toString();
  }
}
