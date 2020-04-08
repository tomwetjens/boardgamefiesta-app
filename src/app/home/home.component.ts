import {Component, OnDestroy, OnInit} from '@angular/core';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Game} from '../model';
import {distinctUntilChanged, filter, flatMap, map, takeUntil} from 'rxjs/operators';
import {UserService} from '../user.service';
import {GameService} from '../game.service';
import {EventService} from '../event.service';

export interface GameItem {
  game: Game;
  players: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  loggedIn: Observable<boolean>;
  currentUser: Observable<object>;

  games = new ReplaySubject<GameItem[]>(1);

  constructor(private gameService: GameService,
              private userService: UserService,
              private eventService: EventService) {
    this.loggedIn = this.userService.loggedIn;
    this.currentUser = userService.currentUser;
  }

  ngOnInit(): void {
    this.userService.loggedIn
      .pipe(
        takeUntil(this.destroyed),
        distinctUntilChanged(),
        filter(loggedIn => loggedIn))
      .subscribe(() => this.refresh());

    this.userService.loggedIn
      .pipe(
        takeUntil(this.destroyed),
        flatMap(() => this.eventService.events))
      .subscribe(event => {
        console.log('Home: event=', event);
      });
  }

  login() {
    this.userService.login();
  }

  logout() {
    this.userService.logout();
  }

  private refresh() {
    this.gameService.find()
      .pipe(map(games => games.map(game => ({game, players: game.players.map(player => player.user.username).join(', ')}))))
      .subscribe(games => this.games.next(games));
  }

  accept(game: Game) {
    this.gameService.accept(game.id)
      .subscribe(() => this.refresh());
  }

  reject(game: Game) {
    this.gameService.reject(game.id)
      .subscribe(() => this.refresh());
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }
}
