import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game, Table, TablePlayer, TableStatus, TableType} from '../shared/model';
import {combineLatest, Observable, ReplaySubject, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {TableService} from '../table.service';
import {EventService} from '../event.service';
import {distinctUntilChanged, map, takeUntil, tap} from 'rxjs/operators';
import {GameService} from '../game.service';
import {AuthService} from '../auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  loggedIn: Observable<boolean>;
  games = new ReplaySubject<Game[]>(1);
  tables = new ReplaySubject<Table[]>(1);
  realtimeTables: Observable<Table[]>;

  constructor(private router: Router,
              private authService: AuthService,
              private tableService: TableService,
              private eventService: EventService,
              private gameService: GameService) {
    this.loggedIn = authService.loggedIn;
  }

  ngOnInit(): void {
    combineLatest([this.authService.loggedIn, this.eventService.events])
      .pipe(
        takeUntil(this.destroyed),
        tap(event => console.log('HomeComponent event:', event)))
      .subscribe(([loggedIn, event]) => {
        if (loggedIn && event.tableId) {
          this.refreshTables();
        }
      });

    this.realtimeTables = this.tables
      .pipe(map(tables => tables
        .filter(table => table.type === TableType.REALTIME)
        .filter(table => table.status === TableStatus.NEW || table.status === TableStatus.STARTED)));

    this.authService.loggedIn
      .pipe(distinctUntilChanged())
      .subscribe(loggedIn => {
        if (loggedIn) {
          this.refreshTables();
        }
      });

    this.refreshGames();
  }

  private refreshGames() {
    this.gameService.list()
      .subscribe(games => this.games.next(games));
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
    this.router.navigate(['/table/', table.id]);
  }

  private refreshTables() {
    this.tableService.find()
      .subscribe(tables => this.tables.next(tables));
  }

  play(game: Game) {
    this.tableService.create({
      game: game.id,
      type: TableType.REALTIME
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
