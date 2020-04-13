import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {flatMap, switchMap, take} from 'rxjs/operators';
import {Action, ActionType, CattleCard, Game, PossibleMove, State} from '../model';
import {EventService} from '../event.service';
import {GameService} from '../game.service';
import {HandSelectComponent} from '../hand-select/hand-select.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game = new ReplaySubject<Game>(1);
  state = new ReplaySubject<State>(1);

  possibleMoves: Observable<PossibleMove[]>;
  selectedAction: ActionType;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private eventService: EventService,
              private ngbModal: NgbModal) {

  }

  ngOnInit(): void {
    this.route.params
      .pipe(flatMap(params => this.gameService.get(params.id)))
      .subscribe(game => this.game.next(game));

    this.game.subscribe(() => this.refreshState());

    this.eventService.events
      .subscribe(event => {
        console.log('GameComponent: event=', event);

        if (event.type === 'STATE_CHANGED') {
          this.refreshState();
        }
      });

    this.state.subscribe(state => {
      console.log(state.turn, state.actions);
      if (state.turn && state.actions.length === 1) {
        this.selectedAction = state.actions[0];
        console.log(this.selectedAction);
      }
    });
  }

  start() {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.start(game.id)))
      .subscribe(game => this.game.next(game));
  }

  perform(action: Action) {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.perform(game.id, action)))
      .subscribe(state => {
        this.state.next(state);
        this.selectedAction = null;
      });
  }

  endTurn() {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.endTurn(game.id)))
      .subscribe(state => this.state.next(state));
  }

  selectAction(actionType: ActionType) {
    this.state.pipe(take(1))
      .subscribe(state => {
        switch (actionType) {
          case 'DISCARD_PAIR_TO_GAIN_4_DOLLARS':
            const modalRef = this.ngbModal.open(HandSelectComponent);
            modalRef.componentInstance.hand = state.player.hand;
            modalRef.componentInstance.mode = 'DISCARD';
            modalRef.componentInstance.pair = true;
            fromPromise(modalRef.result)
              .subscribe(cards => this.perform({
                type: actionType,
                cattleType: (cards[0] as CattleCard).type
              }), err => this.selectedAction = null);
            break;

          case 'SINGLE_AUXILIARY_ACTION':
          case 'SINGLE_OR_DOUBLE_AUXILIARY_ACTION':
          case 'TRADE_WITH_INDIANS':
            this.selectedAction = actionType;
            break;

          default:
            this.perform({type: actionType});
            break;
        }
      });
  }

  private refreshState() {
    this.game.pipe(
      take(1),
      switchMap(game => this.gameService.getState(game.id)))
      .subscribe(state => this.state.next(state));
  }

}
