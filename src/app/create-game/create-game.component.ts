import {Component, OnInit} from '@angular/core';
import {User} from '../model';
import {GameService} from '../game.service';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  invitedUsers: User[] = [];
  inviting = false;
  beginner = false;

  constructor(private gameService: GameService) {
  }

  ngOnInit(): void {
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
    this.gameService.create({
      inviteUserIds: this.invitedUsers.map(user => user.id)
    })
      .subscribe(game => console.log(game));
  }

  get valid(): boolean {
    return this.invitedUsers.length > 0;
  }

  invite() {
    this.inviting = true;
  }
}
