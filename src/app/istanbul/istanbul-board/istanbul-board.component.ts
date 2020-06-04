import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges} from '@angular/core';
import {BoardComponent} from '../../shared/api';
import {Action, BonusCard, Caravansary, GoodsType, Istanbul, Market, PlayerState} from '../model';
import {PlayerColor, Table, TablePlayer} from '../../shared/model';
import {TranslateService} from '@ngx-translate/core';
import en from '../locale/en.json';
import nl from '../locale/nl.json';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {SellGoodsDialogComponent} from '../sell-goods-dialog/sell-goods-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {GuessDialogComponent} from '../guess-dialog/guess-dialog.component';
import {MessageDialogComponent} from '../../shared/message-dialog/message-dialog.component';

const AUTO_SELECTED_ACTIONS = [Action.MOVE];

@Component({
  selector: 'app-istanbul-board',
  templateUrl: './istanbul-board.component.html',
  styleUrls: ['./istanbul-board.component.scss']
})
export class IstanbulBoardComponent implements OnInit, OnChanges, BoardComponent {

  @Input() state: Istanbul;
  @Input() table: Table;

  @Output() endTurn = new EventEmitter<void>();
  @Output() perform = new EventEmitter<any>();
  @Output() skip = new EventEmitter<void>();

  selectedAction: Action;

  Math = window.Math;

  private player: TablePlayer;
  private playerState: PlayerState;
  private currentPlace: { x, y: number };

  goodsTypes: GoodsType[] = Object.keys(GoodsType).map(key => key as GoodsType);

  constructor(private translateService: TranslateService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.translateService.setTranslation('en', en, true);
    this.translateService.setTranslation('nl', nl, true);

    this.ngOnChanges({
      table: new SimpleChange(undefined, this.table, true),
      state: new SimpleChange(undefined, this.state, true)
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.state || changes.table) {
      this.player = this.table.players[this.table.player];
      this.playerState = this.state.players[this.player.color];
      this.currentPlace = this.getCurrentPlace(this.player.color);

      this.autoSelectAction();
    }
  }

  private getCurrentPlace(color: PlayerColor): { x, y: number } {
    for (let x = 0; x < this.state.layout.length; x++) {
      for (let y = 0; y < this.state.layout[x].length; y++) {
        const place = this.state.layout[x][y];
        if (place.merchants && place.merchants.find(merchant => merchant.color === color)) {
          return {x, y};
        }
      }
    }
    return null;
  }

  private autoSelectAction() {
    if (this.selectedAction && (!this.state.actions || !this.state.actions.includes(this.selectedAction))) {
      this.selectedAction = null;
    }

    if (!this.selectedAction && this.state.actions) {
      for (const action of AUTO_SELECTED_ACTIONS) {
        if (this.state.actions.includes(action)) {
          this.selectAction(action);
          break;
        }
      }
    } else if (this.selectedAction) {
      this.selectAction(this.selectedAction);
    }
  }

  get canSkip(): boolean {
    return this.state.actions && this.state.actions.length > 0;
  }

  selectAction(action: string) {
    switch (action as Action) {
      case Action.MOVE:
        this.selectedAction = action as Action;
        // Places become selectable
        break;

      case Action.DISCARD_BONUS_CARD:
        return this.discardBonusCard(action);

      case Action.SELL_GOODS:
        return this.sellGoods();

      case Action.GUESS_AND_ROLL_FOR_LIRA:
        return this.guessAndRollForLira();

      case Action.TAKE_2_BONUS_CARDS:
        return this.take2BonusCards();

      default:
        this.selectedAction = null;
        this.perform.emit({type: action});
    }
  }

  private discardBonusCard(action: string) {
    if (this.playerState && this.playerState.bonusCards.length === 1) {
      this.perform.emit({type: action, bonusCard: this.playerState.bonusCards[0]});
    } else {
      this.selectedAction = action as Action;
    }
  }

  private sellGoods() {
    const ngbModalRef = this.ngbModal.open(SellGoodsDialogComponent);

    const componentInstance = ngbModalRef.componentInstance as SellGoodsDialogComponent;
    componentInstance.market = this.state.layout[this.currentPlace.x][this.currentPlace.y] as Market;
    componentInstance.playerState = this.playerState;

    fromPromise(ngbModalRef.result)
      .subscribe(goods => {
        this.perform.emit({type: Action.SELL_GOODS, goods});
      });
  }

  private guessAndRollForLira() {
    const ngbModalRef = this.ngbModal.open(GuessDialogComponent);

    fromPromise(ngbModalRef.result)
      .subscribe(guess => {
        this.perform.emit({type: Action.GUESS_AND_ROLL_FOR_LIRA, guess});
      });
  }

  canSelectPlace(x: number, y: number): boolean {
    // TODO Support 0 or 3..4 steps
    return this.selectedAction === Action.MOVE
      && this.currentPlace
      && (x !== this.currentPlace.x || y !== this.currentPlace.y)
      && Math.abs(this.currentPlace.x - x) + Math.abs(this.currentPlace.y - y) <= 2;
  }

  selectPlace(x: number, y: number) {
    if (!this.canSelectPlace(x, y)) {
      return;
    }

    this.perform.emit({type: this.selectedAction, x, y});
  }

  private take2BonusCards() {
    const caravansary = this.state.layout[this.currentPlace.x][this.currentPlace.y] as Caravansary;

    if (caravansary.discardPile && caravansary.discardPile.length > 0) {
      const ngbModalRef = this.ngbModal.open(MessageDialogComponent);

      const componentInstance = ngbModalRef.componentInstance as MessageDialogComponent;
      componentInstance.type = 'confirm';
      componentInstance.titleKey = 'istanbul.caravansaryConfirmDialog';
      componentInstance.messageKey = 'istanbul.caravansaryConfirmMessage';
      componentInstance.confirmKey = 'istanbul.takeFromDiscardPile';
      componentInstance.cancelKey = 'istanbul.takeFromDrawStack';

      fromPromise(ngbModalRef.result)
        .subscribe(() => this.perform.emit({type: Action.TAKE_2_BONUS_CARDS, fromCaravansary: true}),
          () => this.perform.emit({type: Action.TAKE_2_BONUS_CARDS, fromCaravansary: false}));
    } else {
      this.perform.emit({type: Action.TAKE_2_BONUS_CARDS, fromCaravansary: false});
    }
  }

  canSelectBonusCard(bonusCard: BonusCard): boolean {
    return [Action.DISCARD_BONUS_CARD].includes(this.selectedAction);
  }

  selectBonusCard(bonusCard: BonusCard) {
    switch (this.selectedAction) {
      case Action.DISCARD_BONUS_CARD:
        this.perform.emit({type: this.selectedAction, bonusCard});
        break;
    }
  }
}
