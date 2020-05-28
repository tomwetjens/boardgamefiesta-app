import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {LocationService} from '../shared/location.service';

@Component({
  selector: 'app-location-selector',
  templateUrl: './location-selector.component.html',
  styleUrls: ['./location-selector.component.scss']
})
export class LocationSelectorComponent implements OnInit {

  @Input() value?: string;

  @Output() changeLocation = new EventEmitter<string>();

  codes: string[];
  names: { [code: string]: string };

  constructor(private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.codes = this.locationService.codes;

    this.locationService.names
      .subscribe(names => {
        this.names = names;
        this.codes.sort((a, b) => this.names[a].localeCompare(this.names[b]));
      });
  }

}
