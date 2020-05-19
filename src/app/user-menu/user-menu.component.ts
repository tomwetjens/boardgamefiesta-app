import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {UserService} from "../user.service";
import {User} from "../shared/model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss']
})
export class UserMenuComponent implements OnInit {

  user: Observable<User>;

  constructor(private router: Router,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
  }

  logout() {
    this.userService.logout();

    this.router.navigate(['/']);
  }

}
