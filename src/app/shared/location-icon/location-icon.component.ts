import {Component, Input, OnInit} from '@angular/core';
import {LocationService} from '../location.service';
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

@Component({
  selector: 'app-location-icon',
  templateUrl: './location-icon.component.html',
  styleUrls: ['./location-icon.component.scss']
})
export class LocationIconComponent implements OnInit {

  @Input() location: string;

  name: Observable<string>;

  constructor(private locationService: LocationService) {
  }

  ngOnInit(): void {
    this.name = this.locationService.names
      .pipe(map(names => names[this.location]));
  }

}
