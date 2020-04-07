import {Component, OnInit} from '@angular/core';
import {ReplaySubject} from 'rxjs';
import {Game} from '../model';
import {ActivatedRoute} from '@angular/router';
import {flatMap, map, switchMap, take} from 'rxjs/operators';
import {GameService} from '../game.service';

@Component({
  selector: 'app-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.scss']
})
export class LobbyComponent implements OnInit {

  game = new ReplaySubject<Game>(1);

  canStart = this.game.pipe(map(game => game.status === 'NEW'));

  constructor(private route: ActivatedRoute, private gameService: GameService) {
  }

  ngOnInit(): void {
    this.route.params
      .pipe(switchMap(params => this.gameService.get(params.id)))
      .subscribe(game => this.game.next(game));
  }

  start() {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.start(game.id)))
      .subscribe(game => this.game.next(game));
  }
}
