import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {Table} from "../../shared/model";
import {Action, State} from "../../gwt/model";
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../../table.service";
import {map} from "rxjs/operators";

@Component({
  selector: 'power-grid',
  templateUrl: './power-grid.component.html',
  styleUrls: ['./power-grid.component.scss']
})
export class PowerGridComponent implements OnInit {

  table$: Observable<Table>;
  state$: Observable<State>;
  canSkip$: Observable<boolean>;

  busy = false;

  constructor(private route: ActivatedRoute,
              private tableService: TableService) {
    this.table$ = this.tableService.table$;
    this.state$ = this.tableService.state$;
    this.canSkip$ = this.state$.pipe(map(state => state && state.actions && state.actions.length > 0));
  }

  ngOnInit(): void {
  }

  perform(table: Table, action: Action) {
    this.busy = true;
    this.tableService.perform(table.id, action)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

  skip(table: Table) {
    this.busy = true;
    this.tableService.skip(table.id)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

  endTurn(table: Table) {
    this.busy = true;
    this.tableService.endTurn(table.id)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

  undo(table: Table) {
    this.busy = true;
    this.tableService.undo(table.id)
      .subscribe(() => this.tableService.refreshState(), () => this.busy = false, () => this.busy = false);
  }

}
