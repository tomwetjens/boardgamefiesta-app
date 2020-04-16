import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, flatMap, switchMap, take} from 'rxjs/operators';
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

    this.game
      .pipe(filter(game => game.status !== 'NEW'))
      .subscribe(() => this.refreshState());

    this.eventService.events
      .subscribe(event => {
        if (event.type === 'STATE_CHANGED') {
          this.refreshState();
        }
      });

    this.state.subscribe(state => {
      if (state.turn && state.actions.length === 1 && ['MOVE', 'DISCARD_CARD', 'CHOOSE_FORESIGHTS', 'DELIVER_TO_CITY'].includes(state.actions[0])) {
        this.selectedAction = state.actions[0];
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
        this.selectedAction = null;
        this.state.next(state);
      });
  }

  endTurn() {
    this.game
      .pipe(take(1), flatMap(game => this.gameService.endTurn(game.id)))
      .subscribe(state => this.state.next(state));
  }

  selectAction(actionType: ActionType) {
    console.log('selectAction: ', actionType);

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

          case 'DISCARD_1_DUTCH_BELT':
          case 'GAIN_2_DOLLARS':
          case 'GAIN_1_DOLLAR':
          case 'GAIN_1_CERTIFICATE':
          case 'DRAW_CARD':
          case 'DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES':
          case 'DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS':
          case 'DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE':
          case 'DISCARD_1_GUERNSEY':
          case 'DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS':
          case 'DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS':
          case 'SINGLE_AUXILIARY_ACTION':
          case 'SINGLE_OR_DOUBLE_AUXILIARY_ACTION':
          case 'UPGRADE_STATION':
          case 'DISCARD_1_DUTCH_BELT_TO_GAIN_2_DOLLARS':
            this.perform({type: actionType});
            break;

          default:
            this.selectedAction = actionType;
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

  cancelAction() {
    this.selectedAction = null;
  }
}
