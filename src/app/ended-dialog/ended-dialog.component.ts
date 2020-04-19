import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Game, GamePlayer} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit, OnChanges {

  @Input() game: Game;

  players: GamePlayer[];

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.updatePlayers();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.updatePlayers();
  }

  private updatePlayers() {
    this.players = this.game.otherPlayers
      .concat(this.game.player)
      .sort((a, b) => a.score - b.score);
  }
}
