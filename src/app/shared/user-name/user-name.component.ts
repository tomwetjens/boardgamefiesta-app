import {Component, Input, OnInit} from '@angular/core';
import {PlayerColor, User} from '../model';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss']
})
export class UserNameComponent implements OnInit {

  @Input() user: User;
  @Input() color?: PlayerColor;

  constructor() {
  }

  ngOnInit(): void {
  }

}
