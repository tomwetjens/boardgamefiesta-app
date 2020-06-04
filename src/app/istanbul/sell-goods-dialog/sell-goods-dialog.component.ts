import {Component, Input, OnInit} from '@angular/core';
import {GoodsType, Market, PlayerState} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

const SMALL_MARKET_REWARDS = [2, 5, 9, 14, 20];
const LARGE_MARKET_REWARDS = [3, 7, 12, 18, 25];

@Component({
  selector: 'app-sell-goods-dialog',
  templateUrl: './sell-goods-dialog.component.html',
  styleUrls: ['./sell-goods-dialog.component.scss']
})
export class SellGoodsDialogComponent implements OnInit {

  @Input() market: Market;
  @Input() playerState: PlayerState;

  model: boolean[] = Array(5).fill(false);

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  canSelect(index: number) {
    const goodsType = this.market.demand[index];
    return this.model[index]
      || this.hasEnoughGoods(goodsType, this.numberOfSelectedGoods(goodsType) + 1);
  }

  get rewards(): number[] {
    return this.market.number === 10 ? LARGE_MARKET_REWARDS : SMALL_MARKET_REWARDS;
  }

  get reward(): number {
    const numberOfSelectedGoods = this.model.filter(selected => selected).length;
    return numberOfSelectedGoods > 0 ? this.rewards[numberOfSelectedGoods - 1] : 0;
  }

  private numberOfSelectedGoods(goodsType: GoodsType): number {
    return this.selectedGoods
      .filter(selectedGoodsType => selectedGoodsType === goodsType)
      .length;
  }

  get selectedGoods(): GoodsType[] {
    return this.model
      .map((selected, index) => selected ? this.market.demand[index] : null)
      .filter(goodsType => !!goodsType);
  }

  private hasEnoughGoods(goodsType: GoodsType, amount: number) {
    return this.playerState.goods[goodsType]
      && this.playerState.goods[goodsType] >= amount;
  }
}
