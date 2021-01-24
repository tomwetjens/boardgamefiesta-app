import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import moment from "moment-timezone";

@Component({
  selector: 'app-time-zone-selector',
  templateUrl: './time-zone-selector.component.html',
  styleUrls: ['./time-zone-selector.component.scss']
})
export class TimeZoneSelectorComponent implements OnInit {

  @Input() value?: string;

  @Output() changeTimeZone = new EventEmitter<string>();

  timeZones: string[];

  constructor() {
  }

  ngOnInit(): void {
    this.timeZones = moment.tz.names()
      .filter(name => !name.startsWith('Etc/')) // Exclude 'Etc/GMT+1 etc.
      .filter(name => name.includes('/')); // Exclude 'GB', 'GMT', etc.
  }

}
