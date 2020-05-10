import {Component, OnDestroy, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {map, takeUntil} from 'rxjs/operators';
import {EventType, Game} from '../model';
import {Router} from '@angular/router';
import {ReplaySubject, Subject} from 'rxjs';
import {EventService} from '../event.service';

export interface GameItem {
  game: Game;
  otherPlayers: string;
}

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  games = new ReplaySubject<GameItem[]>(1);

  constructor(private router: Router,
              private gameService: GameService,
              private eventService: EventService) {
    this.eventService.events
      .pipe(takeUntil(this.destroyed))
      .subscribe(event => {
        switch (event.type) {
          case EventType.ACCEPTED:
          case EventType.REJECTED:
          case EventType.STARTED:
          case EventType.ENDED:
            this.refresh();
            break;
        }
      });
  }

  ngOnInit(): void {
    this.refresh();
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  accept(game: Game) {
    this.gameService.accept(game.id)
      .subscribe(() => this.refresh());
  }

  reject(game: Game) {
    this.gameService.reject(game.id)
      .subscribe(() => this.refresh());
  }

  openGame(game: Game) {
    this.router.navigate(['/games/', game.id]);
  }

  private refresh() {
    this.gameService.find()
      .pipe(map(games => games.map(game => ({
        game,
        otherPlayers: game.otherPlayers
          .map(name => game.players[name].user ? game.players[name].user.username : 'Computer').join(', ')
      }))))
      .subscribe(games => this.games.next(games));
  }

}
