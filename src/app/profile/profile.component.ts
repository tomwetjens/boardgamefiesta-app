import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../shared/model';
import {Observable} from 'rxjs';

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

  changeLocation(user: User, location: string) {
    this.userService.changeLocation(user.id, location)
      .subscribe(() => user.location = location);
  }

  changeLanguage(user: User, language: string) {
    this.userService.changeLanguage(user.id, language)
      .subscribe(() => {
        window.location.reload();
      });
  }
}
