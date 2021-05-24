import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Table, TablePlayer} from "../../shared/model";
import {BigBazar, PlayerState} from "../model";

interface Column {
  player: TablePlayer;
  playerState: PlayerState;
}

@Component({
  selector: 'big-bazar-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit {

  @Input() table: Table;
  @Input() state: BigBazar;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  get columns(): Column[] {
    return [this.table.player, ...this.table.otherPlayers]
      .filter(playerId => !!playerId)
      .map(playerId => this.table.players[playerId])
      .map(player => ({
        player,
        playerState: this.state.players[player.color]
      }));
  }

}
