import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Table} from "../../shared/model";
import {TableService} from "../../table.service";
import {Action, State} from "../model";

@Component({
  selector: 'app-gwt',
  templateUrl: './gwt.component.html',
  styleUrls: ['./gwt.component.scss']
})
export class GwtComponent implements OnInit {

  table$: Observable<Table>;
  state$: Observable<State>;

  constructor(private route: ActivatedRoute,
              private tableService: TableService) {
    this.table$ = this.tableService.table$;
    this.state$ = this.tableService.state$;
  }

  ngOnInit(): void {
  }

  perform(table: Table, action: Action) {
    this.tableService.perform(table.id, action)
      .subscribe(() => this.tableService.refreshState());
  }

  skip(table: Table) {
    this.tableService.skip(table.id)
      .subscribe(() => this.tableService.refreshState());
  }

  endTurn(table: Table) {
    this.tableService.endTurn(table.id)
      .subscribe(() => this.tableService.refreshState());
  }
}
