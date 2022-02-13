import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableService} from "../../table.service";
import {Observable, ReplaySubject} from "rxjs";
import {Table} from "../../shared/model";
import {Action, ActionName, State} from "../model";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'ds-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private destroyed = new ReplaySubject<boolean>(1);

  table$: Observable<Table>;
  state$: Observable<State>;

  selectedAction: ActionName;

  constructor(private tableService: TableService) {
    this.table$ = tableService.table$;
    this.state$ = tableService.state$;
  }

  ngOnInit(): void {
    this.state$
      .pipe(takeUntil(this.destroyed))
      .subscribe(state => {
        this.autoSelectAction(state);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  perform(action: Action, table: Table) {
    this.tableService.perform(table.id, action).subscribe();
  }

  private autoSelectAction(state: State) {
    if (!this.selectedAction || !state?.actions?.includes(this.selectedAction)) {
      if (state?.actions?.length === 1) {
        this.selectedAction = state.actions[0];
        console.log('Automatically selected action: ' + this.selectedAction);
      } else {
        this.selectedAction = null;
      }
    }
  }
}
