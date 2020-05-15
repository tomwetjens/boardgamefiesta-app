import {Component, OnDestroy, OnInit} from '@angular/core';
import {Game, Table, TableType} from '../model';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {Router} from '@angular/router';
import {TableService} from '../table.service';
import {EventService} from '../event.service';
import {map, takeUntil} from 'rxjs/operators';
import {GameService} from '../game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  games = new ReplaySubject<Game[]>(1);
  tables = new ReplaySubject<Table[]>(1);
  realtimeTables: Observable<Table[]>;

  constructor(private router: Router,
              private tableService: TableService,
              private eventService: EventService,
              private gameService: GameService) {
  }

  ngOnInit(): void {
    this.eventService.events
      .pipe(takeUntil(this.destroyed))
      .subscribe(event => {
        if (event.tableId) {
          this.refreshTables();
        }
      });

    this.realtimeTables = this.tables.asObservable()
      .pipe(map(tables => tables.filter(table => table.type === TableType.REALTIME)));

    this.refreshGames();
    this.refreshTables();
  }

  private refreshGames() {
    this.gameService.get()
      .subscribe(games => this.games.next(games));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  accept(table: Table) {
    this.tableService.accept(table.id)
      .subscribe(() => this.refreshTables());
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

}
