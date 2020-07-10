import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../game.service";
import {switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {Game, TableMode, TableType} from "../../shared/model";
import {TableService} from "../../table.service";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private gameService: GameService,
              private tableService: TableService) {}

  game: Observable<Game>;

  screenshots = [];

  ngOnInit(): void {
    this.game = this.route.params
      .pipe(switchMap(params => {
        console.log(params);
        return this.gameService.get(params.id);
      }));
  }

  play(game: Game) {
    this.tableService.create({
      game: game.id,
      type: TableType.REALTIME,
      mode: TableMode.NORMAL
    }).subscribe(table => {
      this.router.navigate(['/table/', table.id]);
    });
  }

}
