import {Component, OnInit} from '@angular/core';
import {Observable, ReplaySubject} from 'rxjs';
import {Game} from '../model';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../environments/environment';
import {distinctUntilChanged, filter, map} from 'rxjs/operators';
import {UserService} from '../user.service';

export interface GameItem {
  game: Game;
  players: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  loggedIn: Observable<boolean>;
  currentUser: Observable<object>;

  games = new ReplaySubject<GameItem[]>(1);

  constructor(private httpClient: HttpClient, private userService: UserService) {
    this.loggedIn = this.userService.loggedIn;
    this.currentUser = userService.currentUser;
  }

  ngOnInit(): void {
    this.userService.loggedIn
      .pipe(distinctUntilChanged(), filter(loggedIn => loggedIn))
      .subscribe(() => this.refresh());
  }

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout();
  }

  private refresh() {
    this.httpClient.get<Game[]>(environment.apiBaseUrl + '/games')
      .pipe(map(games => games.map(game => ({game, players: game.players.map(player => player.user.username).join(', ')}))))
      .subscribe(games => this.games.next(games));
  }

  accept(game: Game) {
    this.httpClient.post(environment.apiBaseUrl + '/games/' + game.id + '/accept', null)
      .subscribe(() => this.refresh());
  }

  reject(game: Game) {
    this.httpClient.post(environment.apiBaseUrl + '/games/' + game.id + '/reject', null)
      .subscribe(() => this.refresh());
  }
}
