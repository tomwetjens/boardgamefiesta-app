import {Component, Input, OnInit} from '@angular/core';
import {Observable, ReplaySubject} from "rxjs";
import {User} from "../shared/model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../user.service";
import {tap} from "rxjs/operators";
import {TableService} from "../table.service";

@Component({
  selector: 'app-invite-player',
  templateUrl: './invite-player.component.html',
  styleUrls: ['./invite-player.component.scss']
})
export class InvitePlayerComponent implements OnInit {

  @Input() tableId: string;

  text: string;
  searching: boolean;
  users = new ReplaySubject<User[]>();

  suggestions$: Observable<User[]>;

  constructor(public ngbActiveModal: NgbActiveModal,
              private userService: UserService,
              private tableService: TableService) {
  }

  ngOnInit(): void {
    this.suggestions$ = this.tableService.getSuggestedPlayers(this.tableId);
  }

  search() {
    if (this.searching) {
      return;
    }

    this.searching = true;

    this.userService.find(this.text)
      .pipe(tap(() => this.searching = false))
      .subscribe(users => this.users.next(users));
  }

}
