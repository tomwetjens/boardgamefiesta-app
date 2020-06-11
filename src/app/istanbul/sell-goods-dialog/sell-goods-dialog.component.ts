import {Component, Input, OnInit} from '@angular/core';
import {BonusCard, GoodsType, Market, PlayerState} from '../model';
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

  goodsTypes: GoodsType[] = Object.keys(GoodsType).map(key => key as GoodsType);

  bonusCard = BonusCard.SMALL_MARKET_ANY_GOOD;

  demandModel: boolean[] = Array(5).fill(false);

  anyGoodsModel: { [goodsType in GoodsType]: number } = {
    BLUE: 0,
    SPICE: 0,
    FABRIC: 0,
    FRUIT: 0
  };

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
    console.log(this.goodsTypes);
  }

  canSelectDemand(index: number): boolean {
    const goodsType = this.market.demand[index];
    return this.demandModel[index]
      || this.hasEnoughGoods(goodsType, this.numberOfSelectedDemandGoods(goodsType) + 1);
  }

  get numberOfSelectedAnyGoods(): number {
    return this.anyGoodsModel.BLUE + this.anyGoodsModel.FABRIC + this.anyGoodsModel.FRUIT + this.anyGoodsModel.SPICE;
  }

  get hasAnyGoodBonusCard(): boolean {
    return this.market.number === 11 && this.playerState.bonusCards.includes(this.bonusCard);
  }

  get rewards(): number[] {
    return this.market.number === 10 ? LARGE_MARKET_REWARDS : SMALL_MARKET_REWARDS;
  }

  get rewardForDemand(): number {
    const num = this.demandModel.filter(selected => selected).length;
    return num > 0 ? this.rewards[num - 1] : 0;
  }

  get rewardForAnyGoods(): number {
    const num = this.numberOfSelectedAnyGoods;
    return num > 0 ? this.rewards[num - 1] : 0;
  }

  private numberOfSelectedDemandGoods(goodsType: GoodsType): number {
    return this.selectedGoods
      .filter(selectedGoodsType => selectedGoodsType === goodsType)
      .length;
  }

  get selectedGoods(): GoodsType[] {
    return this.demandModel
      .map((selected, index) => selected ? this.market.demand[index] : null)
      .filter(goodsType => !!goodsType);
  }

  get selectedAnyGoods(): GoodsType[] {
    return this.goodsTypes
      .flatMap(goodsType => Array(this.anyGoodsModel[goodsType]).fill(goodsType));
  }

  private hasEnoughGoods(goodsType: GoodsType, amount: number) {
    return this.playerState.goods[goodsType]
      && this.playerState.goods[goodsType] >= amount;
  }
}
