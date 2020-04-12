import {Component, OnInit} from '@angular/core';
import {GameService} from '../game.service';
import {map} from 'rxjs/operators';
import {Game} from '../model';
import {Router} from '@angular/router';
import {ReplaySubject} from 'rxjs';
import {GameItem} from '../home/home.component';

@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  games = new ReplaySubject<GameItem[]>(1);

  constructor(private router: Router,
              private gameService: GameService) {
  }

  ngOnInit(): void {
    this.refresh();
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
      .pipe(map(games => games.map(game => ({game, otherPlayers: game.otherPlayers.map(player => player.user.username).join(', ')}))))
      .subscribe(games => this.games.next(games));
  }

}
