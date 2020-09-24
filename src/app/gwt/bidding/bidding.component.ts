import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Table} from "../../shared/model";
import {Action, ActionType, State, Status} from "../model";

interface Row {
  position: number;
  cells: Cell[];
}

interface Cell {
  points: number;
  players: string[];
  selectable: boolean;
}

@Component({
  selector: 'gwt-bidding',
  templateUrl: './bidding.component.html',
  styleUrls: ['./bidding.component.scss']
})
export class BiddingComponent implements OnInit, OnChanges {

  @Input() table: Table;
  @Input() state: State;

  @Output() perform = new EventEmitter<Action>();

  columns: number[];
  rows: Row[];

  constructor() {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state) {
      const playerCount = (!!this.state.currentPlayer ? 1 : 0) + this.state.otherPlayers.length;
      const max = this.state.bids
        .map(bid => bid.points || 0)
        .reduce((prev, cur) => Math.max(prev, cur), 0);

      this.columns = Array(Math.max(6, max + playerCount)).fill(null).map((_, index) => index);

      this.rows = Array(playerCount).fill(0)
        .map((_, position) => {
          const contesting = this.state.bids.filter(bid => bid.position == position);
          const min = Math.max(...contesting.map(bid => bid.points));

          return ({
            position,
            cells: this.columns.map(points => ({
              points,
              players: contesting.filter(bid => bid.points == points).map(bid => bid.player),
              selectable: points > min
            }))
          });
        });
    }
  }

  placeBid(position: number, cell: Cell) {
    if (!this.canSelectSpot(position, cell)) {
      return;
    }
    this.perform.emit({type: ActionType.PLACE_BID, position, points: cell.points});
  }

  canSelectSpot(position: number, cell: Cell): boolean {
    return this.state.turn && this.state.status === Status.BIDDING && cell.selectable;
  }
}
