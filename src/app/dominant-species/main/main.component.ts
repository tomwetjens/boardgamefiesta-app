import {Component, OnDestroy, OnInit} from '@angular/core';
import {TableService} from "../../table.service";
import {combineLatest, Observable, ReplaySubject} from "rxjs";
import {Table} from "../../shared/model";
import {Action, ActionName, DominantSpecies} from "../model";
import {takeUntil} from "rxjs/operators";

@Component({
  selector: 'ds-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, OnDestroy {

  private destroyed = new ReplaySubject<boolean>(1);

  table$: Observable<Table>;
  state$: Observable<DominantSpecies>;

  selectedAction: ActionName;

  constructor(private tableService: TableService) {
    this.table$ = tableService.table$;
    this.state$ = tableService.state$;
  }

  ngOnInit(): void {
    combineLatest([this.state$, this.table$])
      .pipe(takeUntil(this.destroyed))
      .subscribe(([state, table]) => {
        this.autoSelectAction(state, table);
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  perform(action: Action, table: Table) {
    this.tableService.perform(table.id, action)
      .subscribe();
  }

  private autoSelectAction(state: DominantSpecies, table: Table) {
    if (!this.selectedAction || !state?.actions?.includes(this.selectedAction)) {
      if (table.turn && state?.actions?.length === 1) {
        this.selectedAction = state.actions[0];
        console.log('Automatically selected action: ' + this.selectedAction);
      } else {
        this.selectedAction = null;
      }
    } else {
      this.selectedAction = null;
    }
  }

  endTurn(table: Table) {
    this.tableService.endTurn(table.id).subscribe();
  }

  skip(table: Table) {
    this.tableService.skip(table.id).subscribe();
  }
}
