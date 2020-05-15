import { Component, OnInit } from '@angular/core';
import {UserService} from "../user.service";
import {User} from "../model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: Observable<User>;

  constructor(private userService: UserService) {
    this.user = this.userService.currentUser;
  }

  ngOnInit(): void {
  }

}
