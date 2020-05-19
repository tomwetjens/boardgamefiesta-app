import { Component, OnInit } from '@angular/core';
import {EventService} from '../../event.service';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent implements OnInit {

  constructor(public eventService: EventService) { }

  ngOnInit(): void {
  }

}
