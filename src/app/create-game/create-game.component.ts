import {Component, OnInit} from '@angular/core';
import {User} from '../model';
import {GameService} from '../game.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-create-game',
  templateUrl: './create-game.component.html',
  styleUrls: ['./create-game.component.scss']
})
export class CreateGameComponent implements OnInit {

  invitedUsers: User[] = [];
  inviting = false;
  beginner = false;

  constructor(private router: Router, private gameService: GameService) {
  }

  ngOnInit(): void {
  }

  addUser(user: User) {
    console.log('addUser:',user);

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
      inviteUserIds: this.invitedUsers.map(user => user.id),
      beginner: this.beginner
    })
      .subscribe(game => this.router.navigate(['/']));
  }

  get valid(): boolean {
    return this.invitedUsers.length > 0;
  }

  invite() {
    this.inviting = true;
  }
}
