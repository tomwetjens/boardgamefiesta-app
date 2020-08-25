import {Component} from '@angular/core';
import {Observable} from "rxjs";
import {EventService} from "../event.service";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  connected$: Observable<boolean>;

  constructor(private eventService: EventService) {
    this.connected$ = eventService.connected;
  }

}
