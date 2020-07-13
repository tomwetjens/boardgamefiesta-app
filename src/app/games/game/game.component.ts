import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {GameService} from "../../game.service";
import {switchMap} from "rxjs/operators";
import {Observable} from "rxjs";
import {Game, TableMode, TableType} from "../../shared/model";
import {TableService} from "../../table.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private translateService: TranslateService,
              private gameService: GameService,
              private tableService: TableService) {
  }

  game: Observable<Game>;

  screenshots = [];

  ngOnInit(): void {
    this.game = this.route.params
      .pipe(switchMap(params => {
        const name = this.translateService.instant('game.' + params.id + '.name');
        if (name) {
          this.title.setTitle(name);
        }
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
