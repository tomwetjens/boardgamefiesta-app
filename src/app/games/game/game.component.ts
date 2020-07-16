import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TableMode, TableType} from "../../shared/model";
import {TableService} from "../../table.service";
import {Title} from "@angular/platform-browser";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {map, switchMap} from "rxjs/operators";

interface Game {
  readonly id: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game: Observable<Game>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private title: Title,
              private translateService: TranslateService,
              private tableService: TableService) {
  }

  ngOnInit(): void {
    this.game = this.route.params
      .pipe(map(params => ({id: params.id})));

    this.game.subscribe(game => {
      const name = this.translateService.instant('game.' + game.id + '.name');
      if (name) {
        this.title.setTitle(name);
      }
    });
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
