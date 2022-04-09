import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Table, TablePlayer} from "../../shared/model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

interface Column {
  player: TablePlayer;
}

@Component({
  selector: 'ds-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit, OnChanges {

  @Input() table: Table;

  columns: Column[];

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    if (this.table) {
      this.calculateColumns();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.table) {
      this.calculateColumns();
    }
  }

  private calculateColumns() {
    this.columns = [this.table.player, ...this.table.otherPlayers]
      .filter(playerId => !!playerId)
      .map(playerId => this.table.players[playerId])
      .map(player => ({player}));
  }
}
