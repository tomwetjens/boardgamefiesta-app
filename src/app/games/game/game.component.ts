import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TableMode, TableType} from "../../shared/model";
import {TableService} from "../../table.service";
import {TranslateService} from "@ngx-translate/core";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {AuthService} from "../../auth.service";
import {TitleService} from "../../title.service";

interface Game {
  readonly id: string;
}

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game$: Observable<Game>;
  loggedIn$: Observable<boolean>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private titleService: TitleService,
              private authService: AuthService,
              private translateService: TranslateService,
              private tableService: TableService) {
  }

  ngOnInit(): void {
    this.loggedIn$ = this.authService.loggedIn.asObservable();

    this.game$ = this.route.params
      .pipe(map(params => ({id: params.id})));

    this.game$.subscribe(game => {
      const name = this.translateService.instant('game.' + game.id + '.name');
      if (name) {
        this.titleService.setTitle(name);
      }
    });
  }

  play(game: Game) {
    this.tableService.create({
      game: game.id,
      type: TableType.REALTIME,
      mode: TableMode.NORMAL
    }).subscribe(table => {
      this.router.navigate([table.game, table.id]);
    });
  }

}
