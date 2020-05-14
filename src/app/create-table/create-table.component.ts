import {Component, OnInit} from '@angular/core';
import {User} from '../model';
import {TableService} from '../table.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-table',
  templateUrl: './create-table.component.html',
  styleUrls: ['./create-table.component.scss']
})
export class CreateTableComponent implements OnInit {

  invitedUsers: User[] = [];
  inviting = false;
  options: { [key: string]: number | string | boolean };

  constructor(private router: Router, private tableService: TableService) {
  }

  ngOnInit(): void {
    this.options = {beginner: false};
  }

  get canInvite(): boolean {
    return this.invitedUsers.length < 3;
  }

  get minNumberOfPlayers(): number {
    return this.invitedUsers.length + 1;
  }

  addUser(user: User) {
    if (this.invitedUsers.find(invitedUser => invitedUser.id === user.id)) {
      return;
    }

    this.invitedUsers.push(user);

    this.inviting = false;
  }

  uninvite(user: User) {
    const index = this.invitedUsers.findIndex(invitedUser => invitedUser.id === user.id);
    if (index < 0) {
      return;
    }

    this.invitedUsers.splice(index, 1);
  }

  create() {
    const request = {
      name: 'gwt',
      inviteUserIds: this.invitedUsers.map(user => user.id),
      options: this.options
    };

    console.log('create:', {request});

    this.tableService.create(request)
      .subscribe(table => this.router.navigate(['/']));
  }

  get valid(): boolean {
    return true;
  }

}
