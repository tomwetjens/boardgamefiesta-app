import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Table, TablePlayer} from '../../shared/model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {ScoreCategory, State} from '../model';
import {AudioService} from "../../audio.service";
import {SCORE_MUSIC} from "../sounds";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";

interface Column {
  player: TablePlayer;
  winner: boolean;
  total: number;
}

interface Row {
  category: ScoreCategory;
  scores: number[];
}

@Component({
  selector: 'app-ended-dialog',
  templateUrl: './ended-dialog.component.html',
  styleUrls: ['./ended-dialog.component.scss']
})
export class EndedDialogComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();

  @Input() table: Table;
  @Input() state: State;

  constructor(public ngbActiveModal: NgbActiveModal,
              private audioService: AudioService) {
  }

  ngOnInit(): void {
    this.audioService.playMusic(SCORE_MUSIC)
      .pipe(takeUntil(this.destroyed))
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  get rows(): Row[] {
    return Object.keys(ScoreCategory)
      .map(category => ({
        category: category as ScoreCategory,
        scores: [this.state.player, ...this.state.otherPlayers]
          .map(player => player.score.categories[category] || 0)
      }));
  }

  get columns(): Column[] {
    return [this.state.player, ...this.state.otherPlayers]
      .map(playerState => ({
        player: this.table.players[playerState.player.name],
        winner: playerState.winner,
        total: playerState.score.total
      }));
  }

}
