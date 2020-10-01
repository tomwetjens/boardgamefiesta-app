import {Component, Input, OnInit} from '@angular/core';
import {GameService, Ranking} from "../../game.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  @Input() gameId: string;

  ranking$: Observable<Ranking[]>;

  constructor(private gameService: GameService) { }

  ngOnInit(): void {
    this.ranking$ = this.gameService.getRanking(this.gameId);
  }

}
