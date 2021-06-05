import {Component, Input, OnInit} from '@angular/core';
import {BonusCard, GoodsType, Market, PlayerState} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

const SMALL_MARKET_REWARDS = [2, 5, 9, 14, 20];
const LARGE_MARKET_REWARDS = [3, 7, 12, 18, 25];

type GoodsModel = {
  [goodsType in GoodsType]: boolean[]
};


@Component({
  selector: 'app-sell-goods-dialog',
  templateUrl: './sell-goods-dialog.component.html',
  styleUrls: ['./sell-goods-dialog.component.scss']
})
export class SellGoodsDialogComponent implements OnInit {

  @Input() market: Market;
  @Input() playerState: PlayerState;

  goodsTypes: GoodsType[] = Object.keys(GoodsType).map(key => key as GoodsType);

  bonusCard = BonusCard.SMALL_MARKET_ANY_GOOD;

  demandModel: GoodsModel;
  anyGoodsModel: GoodsModel;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    this.demandModel = this.goodsTypes.reduce((model, goodsType) => {
      model[goodsType] = Array(Math.min(this.playerState.goods[goodsType] || 0, this.market.demand.filter(gt => gt === goodsType).length)).fill(false);
      return model;
    }, {} as GoodsModel);

    this.anyGoodsModel = this.goodsTypes.reduce((model, goodsType) => {
      model[goodsType] = Array(this.playerState.goods[goodsType] || 0).fill(false);
      return model;
    }, {} as GoodsModel);
  }

  get numberOfSelectedAnyGoods(): number {
    return this.selectedAnyGoods.length;
  }

  get hasAnyGoodBonusCard(): boolean {
    return this.market.number === 11 && this.playerState.bonusCards.includes(this.bonusCard);
  }

  get rewards(): number[] {
    return this.market.number === 10 ? LARGE_MARKET_REWARDS : SMALL_MARKET_REWARDS;
  }

  get rewardForDemand(): number {
    const num = this.selectedGoods.length;;
    return num > 0 ? this.rewards[num - 1] : 0;
  }

  get rewardForAnyGoods(): number {
    const num = this.numberOfSelectedAnyGoods;
    return num > 0 ? this.rewards[num - 1] : 0;
  }

  get selectedGoods(): GoodsType[] {
    return this.goodsTypes.flatMap(goodsType => this.demandModel[goodsType].filter(selected => selected).map(() => goodsType));
  }

  get selectedAnyGoods(): GoodsType[] {
    return this.goodsTypes
      .flatMap(goodsType => this.anyGoodsModel[goodsType]
        .filter(selected => !!selected)
        .map(() => goodsType));
  }

  private hasEnoughGoods(goodsType: GoodsType, amount: number) {
    return this.playerState.goods[goodsType]
      && this.playerState.goods[goodsType] >= amount;
  }

  canSelectAny(goodsType: GoodsType, index: number): boolean {
    return this.isAnySelected(goodsType, index) || this.numberOfSelectedAnyGoods < 5;
  }

  trackByValue(index: number, value: any): any {
    return value;
  }

  trackByIndex(index: number, value: any): any {
    return index;
  }

  private isAnySelected(goodsType: GoodsType, index: number) {
    return this.anyGoodsModel[goodsType][index];
  }
}
