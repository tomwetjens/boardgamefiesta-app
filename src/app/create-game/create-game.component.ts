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
  numberOfPlayers = 2;

  constructor(private router: Router, private gameService: GameService) {
  }

  ngOnInit(): void {
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
    this.numberOfPlayers = Math.max(this.numberOfPlayers, this.minNumberOfPlayers);

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
      inviteUserIds: this.invitedUsers.map(user => user.id),
      beginner: this.beginner,
      numberOfPlayers: this.numberOfPlayers
    };

    console.log('create:', {request});

    this.gameService.create(request)
      .subscribe(game => this.router.navigate(['/']));
  }

  get valid(): boolean {
    return true;
  }

}
