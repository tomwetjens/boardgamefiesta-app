import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../shared/model";

@Component({
  selector: 'user-friend',
  templateUrl: './friend.component.html',
  styleUrls: ['./friend.component.scss']
})
export class FriendComponent implements OnInit {

  @Input() friend: User;

  constructor() { }

  ngOnInit(): void {
  }

}
