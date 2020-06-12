import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {GameService} from "../../game.service";
import {switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {Game} from "../../shared/model";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private gameService: GameService) {}

  game: Observable<Game>;

  ngOnInit(): void {
    this.game = this.route.params
      .pipe(switchMap(params => {
        console.log(params);
        return this.gameService.get(params.id);
      }));
  }

}
