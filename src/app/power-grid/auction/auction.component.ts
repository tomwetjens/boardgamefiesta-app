import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Action, ActionType, Auction} from "../model";

@Component({
  selector: 'power-grid-auction',
  templateUrl: './auction.component.html',
  styleUrls: ['./auction.component.scss']
})
export class AuctionComponent implements OnInit, OnChanges {

  @Input() auction: Auction;
  @Input() bidding: boolean;

  @Output() perform = new EventEmitter<Action>();

  bid: number;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (typeof this.bid === 'undefined') {
      this.bid = this.auction.bid;
    }
  }

  placeBid() {
    this.perform.emit({type: ActionType.PLACE_BID, bid: this.bid});
  }
}
