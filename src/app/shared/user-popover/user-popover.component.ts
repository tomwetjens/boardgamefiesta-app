import {Component, Input, OnInit} from '@angular/core';
import {UserService} from "../../user.service";
import {Observable} from "rxjs";
import {User} from "../model";

@Component({
  selector: 'app-user-popover',
  templateUrl: './user-popover.component.html',
  styleUrls: ['./user-popover.component.scss']
})
export class UserPopoverComponent implements OnInit {

  @Input() userId: string;

  user$: Observable<User>;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.user$ = this.userService.get(this.userId);
  }

}
