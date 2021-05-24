import {Component, OnDestroy, OnInit} from '@angular/core';
import {combineLatest, Observable, Subject} from "rxjs";
import {Table, TableStatus} from "../../shared/model";
import {Action} from "../../gwt/model";
import {ActivatedRoute} from "@angular/router";
import {TableService} from "../../table.service";
import {filter, map, takeUntil} from "rxjs/operators";
import {NgbModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {fromPromise} from "rxjs/internal-compatibility";
import {EndedDialogComponent} from "../ended-dialog/ended-dialog.component";
import {BigBazar} from "../model";

@Component({
  selector: 'app-big-bazar',
  templateUrl: './big-bazar.component.html',
  styleUrls: ['./big-bazar.component.scss']
})
export class BigBazarComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  private dialog: NgbModalRef;

  table$: Observable<Table>;
  state$: Observable<BigBazar>;
  canSkip$: Observable<boolean>;

  busy = false;

  constructor(private route: ActivatedRoute,
              private ngbModal: NgbModal,
              private tableService: TableService) {
    this.table$ = this.tableService.table$;
    this.state$ = this.tableService.state$;

    this.canSkip$ = combineLatest([this.table$, this.state$]).pipe(
      map(([table, state]) => table.turn && state.actions && state.actions.length > 0));
  }

  ngOnInit(): void {
    combineLatest([this.table$, this.state$]).pipe(
      takeUntil(this.destroyed),
      filter(([table, state]) => !!table && !!state))
      .subscribe(([table, state]) => {
        if (table.status === TableStatus.ENDED && !this.dialog) {
          this.dialog = this.ngbModal.open(EndedDialogComponent);

          const componentInstance = this.dialog.componentInstance as EndedDialogComponent;
          componentInstance.table = table;
          componentInstance.state = state;

          fromPromise(this.dialog.result).subscribe(() => {
          }, () => {
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);

    if (this.dialog) {
      this.dialog.close();
    }
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
