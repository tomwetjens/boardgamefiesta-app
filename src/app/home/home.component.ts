import {Component, OnDestroy, OnInit} from '@angular/core';
import {Table, TableMode, TablePlayer, TableType} from '../shared/model';
import {Observable, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {TableService} from '../table.service';
import {map} from 'rxjs/operators';
import {AuthService} from '../auth.service';
import {GameService} from "../game.service";
import {Game} from "../model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  loggedIn$: Observable<boolean>;
  myActiveTables$: Observable<Table[]>;
  myTurnTables$: Observable<Table[]>;
  waitingTables$: Observable<Table[]>;
  games$: Observable<Game[]>;

  constructor(private router: Router,
              private authService: AuthService,
              private gameService: GameService,
              private tableService: TableService) {
    this.loggedIn$ = authService.loggedIn;
    this.games$ = gameService.list();
  }

  ngOnInit(): void {
    this.myActiveTables$ = this.tableService.myActiveTables$;

    this.myTurnTables$ = this.myActiveTables$.pipe(
      map(tables => tables.filter(table => !!table.turn))
    );

    this.waitingTables$ = this.myActiveTables$.pipe(
      map(tables => tables.filter(table => !table.turn))
    );
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  accept(table: Table) {
    this.tableService.accept(table.id)
      .subscribe(() => this.openTable(table));
  }

  reject(table: Table) {
    this.tableService.reject(table.id)
      .subscribe(() => this.refreshTables());
  }

  openTable(table: Table) {
    this.router.navigate([table.game, table.id]);
  }

  private refreshTables() {
    this.tableService.refreshMyActiveTables();
  }

  play(gameId: string) {
    this.tableService.create({
      game: gameId,
      type: TableType.REALTIME,
      mode: TableMode.NORMAL
    }).subscribe(table => {
      this.openTable(table);
    });
  }

  otherHumanPlayers(table: Table): TablePlayer[] {
    return table.otherPlayers.map(playerId => table.players[playerId]).filter(player => !!player.user);
  }

  initLoginFlow() {
    this.authService.initLoginFlow();
  }
}
