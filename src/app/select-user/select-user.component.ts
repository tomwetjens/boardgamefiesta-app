import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {User} from '../model';
import {UserService} from '../user.service';
import {ReplaySubject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-select-user',
  templateUrl: './select-user.component.html',
  styleUrls: ['./select-user.component.scss']
})
export class SelectUserComponent implements OnInit {

  text: string;
  searching: boolean;
  users = new ReplaySubject<User[]>();

  constructor(public ngbActiveModal: NgbActiveModal,
              private userService: UserService) {
  }

  ngOnInit(): void {

  }

  search() {
    if (this.searching) {
      return;
    }

    // TODO Find by email

    this.searching = true;

    this.userService.find(this.text)
      .pipe(tap(() => this.searching = false))
      .subscribe(users => this.users.next(users));
  }

}
