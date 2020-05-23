import {Component, Input, OnInit} from '@angular/core';
import {User} from '../model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {

  @Input() user: User;
  @Input() shadow = false;

  constructor() {
  }

  ngOnInit(): void {
  }

}
