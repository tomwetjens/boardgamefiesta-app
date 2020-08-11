import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Observable} from "rxjs";
import {Table} from "../../shared/model";
import {TableService} from "../../table.service";
import {Action, State} from "../model";
import en from "../locale/en.json";
import nl from "../locale/nl.json";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-gwt',
  templateUrl: './gwt.component.html',
  styleUrls: ['./gwt.component.scss']
})
export class GwtComponent implements OnInit {

  table$: Observable<Table>;
  state$: Observable<State>;

  constructor(private route: ActivatedRoute,
              private tableService: TableService,
              private translateService: TranslateService) {
    this.translateService.setTranslation('en', en, true);
    this.translateService.setTranslation('nl', nl, true);

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

  undo(table: Table) {
    this.tableService.undo(table.id)
      .subscribe(() => this.tableService.refreshState());
  }
}
