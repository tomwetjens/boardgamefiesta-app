import {Component, OnInit} from '@angular/core';
import {TableService} from "../table.service";
import {TitleService} from "../title.service";
import {TranslateService} from "@ngx-translate/core";
import {ActivatedRoute, Router} from "@angular/router";
import {Observable} from "rxjs";
import {map} from "rxjs/operators";
import {TableMode, TableType} from "../shared/model";

@Component({
  selector: 'app-game-tables',
  templateUrl: './game-tables.component.html',
  styleUrls: ['./game-tables.component.scss']
})
export class GameTablesComponent implements OnInit {

  gameId$: Observable<string>;

  constructor(private titleService: TitleService,
              private translateService: TranslateService,
              private tableService: TableService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit(): void {
    this.gameId$ = this.route.params.pipe(
      map(({gameId}) => gameId));

    this.titleService.setTitle(this.translateService.instant('startedTables'));
  }

  createTable(gameId: string) {
    this.tableService.create({
      game: gameId,
      type: TableType.REALTIME,
      mode: TableMode.NORMAL
    }).subscribe(table => {
      this.router.navigate([table.game, table.id]);
    });
  }
}
