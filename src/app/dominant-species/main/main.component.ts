import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {TableService} from "../../table.service";
import {combineLatest, Observable, ReplaySubject} from "rxjs";
import {Table} from "../../shared/model";
import {Action, ActionName, DominantSpecies, ElementType} from "../model";
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
  busy = false;

  selectedAction: ActionName;

  constructor(private ngZone: NgZone,
              private tableService: TableService) {
    this.table$ = tableService.table$;
    this.state$ = tableService.state$;
  }

  ngOnInit(): void {
    combineLatest([this.state$, this.table$])
      .pipe(takeUntil(this.destroyed))
      .subscribe(([state, table]) => {
        this.ngZone.runOutsideAngular(() =>
          this.autoSelectAction(state, table));
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
    if (table.turn && state?.actions?.length === 1) {
      this.selectedAction = state.actions[0];
    } else {
      this.selectedAction = null;
    }
  }

  canAutoEndTurn(table: Table, state: DominantSpecies): boolean {
    return !table.ended && table.turn && state.actions?.length === 0;
  }

  endTurn(table: Table) {
    this.busy = true;
    this.tableService.endTurn(table.id).subscribe(() => this.busy = false, () => this.busy = false);
  }

  skip(table: Table) {
    this.busy = true;
    this.tableService.skip(table.id).subscribe(() => this.busy = false, () => this.busy = false);
  }

  undo(table: Table) {
    this.busy = true;
    this.tableService.undo(table.id).subscribe(() => this.busy = false, () => this.busy = false);
  }

  selectElement(elementType: ElementType, table: Table) {
    this.perform({
      [this.selectedAction]: {
        element: elementType
      }
    }, table);
  }
}
