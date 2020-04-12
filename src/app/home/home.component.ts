import {Component, OnInit} from '@angular/core';
import {Game} from '../model';
import {UserService} from '../user.service';

export interface GameItem {
  game: Game;
  otherPlayers: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(public userService: UserService) {
  }

  ngOnInit(): void {
  }

  login() {
    this.userService.login();
  }

}
