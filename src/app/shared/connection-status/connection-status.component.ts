import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-connection-status',
  templateUrl: './connection-status.component.html',
  styleUrls: ['./connection-status.component.scss']
})
export class ConnectionStatusComponent {

  @Input() connected: boolean;

  constructor() {
  }

}
