import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Table} from "../../shared/model";
import {TableService} from "../../table.service";
import {Action, State} from "../model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-gwt',
  templateUrl: './gwt.component.html',
  styleUrls: ['./gwt.component.scss']
})
export class GwtComponent implements OnInit {

  table$: Observable<Table>;
  state$: Observable<State>;

  busy = false;

  constructor(private route: ActivatedRoute,
              private tableService: TableService,
              private translateService: TranslateService) {
    this.table$ = this.tableService.table$;
    this.state$ = this.tableService.state$;
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
