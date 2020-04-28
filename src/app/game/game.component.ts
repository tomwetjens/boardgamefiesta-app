import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of, ReplaySubject, Subject} from 'rxjs';
import {map, switchMap, take, takeUntil} from 'rxjs/operators';
import {Action, ActionType, EventType, Game, State} from '../model';
import {EventService} from '../event.service';
import {GameService} from '../game.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AudioService} from '../audio.service';
import {EndedDialogComponent} from '../ended-dialog/ended-dialog.component';
import {MessageDialogComponent} from '../message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';

const AUTO_SELECTED_ACTIONS = [
  ActionType.MOVE,
  ActionType.DISCARD_CARD,
  ActionType.CHOOSE_FORESIGHTS,
  ActionType.DELIVER_TO_CITY,
  ActionType.UNLOCK_WHITE,
  ActionType.UNLOCK_BLACK_OR_WHITE,
  ActionType.DOWNGRADE_STATION
];

const FREE_ACTIONS = [
  ActionType.DRAW_CARD,
  ActionType.DRAW_2_CATTLE_CARDS,
  ActionType.GAIN_1_CERTIFICATE,
  ActionType.GAIN_1_DOLLAR,
  ActionType.GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS,
  ActionType.GAIN_1_DOLLAR_PER_ENGINEER,
  ActionType.GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR,
  ActionType.GAIN_2_DOLLARS,
  ActionType.GAIN_4_DOLLARS,
  ActionType.MAX_CERTIFICATES,
  ActionType.MOVE_1_FORWARD,
  ActionType.MOVE_2_FORWARD,
  ActionType.MOVE_3_FORWARD,
  ActionType.MOVE_3_FORWARD_WITHOUT_FEES,
  ActionType.MOVE_4_FORWARD,
  ActionType.MOVE_ENGINE_1_FORWARD,
  ActionType.MOVE_ENGINE_2_OR_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_2_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_3_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_4_FORWARD,
  ActionType.MOVE_ENGINE_AT_MOST_5_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD,
  ActionType.MOVE_ENGINE_FORWARD_UP_TO_NUMBER_OF_BUILDINGS_IN_WOODS,
  ActionType.REMOVE_HAZARD_FOR_FREE,
  ActionType.SINGLE_AUXILIARY_ACTION,
  ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION,
  ActionType.UPGRADE_ANY_STATION_BEHIND_ENGINE,
  ActionType.UPGRADE_STATION,
  ActionType.USE_ADJACENT_BUILDING
];


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();

  game = new ReplaySubject<Game>(1);
  state = new ReplaySubject<State>(1);

  selectedAction: ActionType;

  constructor(private route: ActivatedRoute,
              private gameService: GameService,
              private eventService: EventService,
              private ngbModal: NgbModal,
              private audioService: AudioService) {

  }

  ngOnInit(): void {
    this.refreshGame();

    this.game
      .pipe(
        takeUntil(this.destroyed))
      .subscribe(game => {
        if (game.status !== 'NEW') {
          this.refreshState();
        }

        if (game.status === 'ENDED') {
          const ngbModalRef = this.ngbModal.open(EndedDialogComponent);
          ngbModalRef.componentInstance.game = game;
        }
      });

    this.eventService.events
      .pipe(takeUntil(this.destroyed))
      .subscribe(event => {
        switch (event.type) {
          case EventType.ACCEPTED:
          case EventType.REJECTED:
          case EventType.STARTED:
          case EventType.ENDED:
            this.refreshGame();
            break;

          case EventType.STATE_CHANGED:
            this.refreshState();
            break;
        }
      });

    this.state
      .pipe(takeUntil(this.destroyed))
      .subscribe(state => {
        if (state.turn && state.actions.length === 1 && AUTO_SELECTED_ACTIONS.includes(state.actions[0])) {
          this.selectedAction = state.actions[0];
        } else {
          this.selectedAction = null;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  private refreshGame() {
    this.route.params
      .pipe(switchMap(params => this.gameService.get(params.id)))
      .subscribe(game => this.game.next(game));
  }

  start() {
    this.game
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(game => {
          if (this.hasInvitedPlayers(game)) {
            const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
            ngbModalRef.componentInstance.message = 'Some players have not yet responded. They will not be able to join the game. Do you still want to start the game?';
            ngbModalRef.componentInstance.confirm = 'START';
            ngbModalRef.componentInstance.cancel = 'WAIT_FOR_PLAYERS';
            return fromPromise(ngbModalRef.result)
              .pipe(map(() => game));
          }
          return of(game);
        }),
        switchMap(game => this.gameService.start(game.id)))
      .subscribe();
  }

  private hasInvitedPlayers(game: Game) {
    return game.otherPlayers.some(player => player.status === 'INVITED');
  }

  perform(action: Action) {
    this.game
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(game => this.gameService.perform(game.id, action)))
      .subscribe(state => {
        this.selectedAction = null;
        this.state.next(state);
      });
  }

  skipAction() {
    this.game
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(game => this.gameService.skip(game.id)))
      .subscribe(state => {
        this.selectedAction = null;
        this.state.next(state);
      });
  }

  endTurn() {
    this.state
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(state => {
          if (this.canPerformFreeAction(state)) {
            const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
            ngbModalRef.componentInstance.message = 'You can still perform actions';
            ngbModalRef.componentInstance.confirm = 'END_TURN';
            ngbModalRef.componentInstance.cancel = 'CANCEL';
            return fromPromise(ngbModalRef.result);
          }
          return of(state);
        }),
        switchMap(() => this.game),
        take(1),
        switchMap(game => this.gameService.endTurn(game.id)))
      .subscribe(state => this.state.next(state));
  }

  selectAction(actionType: ActionType) {
    this.state.pipe(
      takeUntil(this.destroyed),
      take(1))
      .subscribe(state => {
        switch (actionType) {
          case ActionType.DISCARD_1_DUTCH_BELT_TO_GAIN_2_DOLLARS:
          case ActionType.DISCARD_1_DUTCH_BELT_TO_GAIN_3_DOLLARS:
          case ActionType.GAIN_2_DOLLARS:
          case ActionType.GAIN_1_DOLLAR:
          case ActionType.GAIN_1_CERTIFICATE:
          case ActionType.DRAW_CARD:
          case ActionType.DISCARD_1_JERSEY_TO_GAIN_2_CERTIFICATES:
          case ActionType.DISCARD_1_JERSEY_TO_GAIN_2_DOLLARS:
          case ActionType.DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE:
          case ActionType.DISCARD_1_GUERNSEY:
          case ActionType.DISCARD_1_BLACK_ANGUS_TO_GAIN_2_DOLLARS:
          case ActionType.DISCARD_1_JERSEY_TO_GAIN_4_DOLLARS:
          case ActionType.SINGLE_AUXILIARY_ACTION:
          case ActionType.SINGLE_OR_DOUBLE_AUXILIARY_ACTION:
          case ActionType.DISCARD_1_BLACK_ANGUS_TO_GAIN_2_CERTIFICATES:
          case ActionType.DISCARD_1_HOLSTEIN_TO_GAIN_10_DOLLARS:
          case ActionType.DISCARD_1_JERSEY_TO_GAIN_1_CERTIFICATE_AND_2_DOLLARS:
          case ActionType.DISCARD_1_JERSEY_TO_MOVE_ENGINE_1_FORWARD:
          case ActionType.DISCARD_1_GUERNSEY_TO_GAIN_4_DOLLARS:
          case ActionType.DRAW_2_CATTLE_CARDS:
          case ActionType.GAIN_2_DOLLARS_PER_BUILDING_IN_WOODS:
          case ActionType.GAIN_1_DOLLAR_PER_ENGINEER:
          case ActionType.GAIN_2_CERTIFICATES_AND_2_DOLLARS_PER_TEEPEE_PAIR:
          case ActionType.GAIN_4_DOLLARS:
          case ActionType.MAX_CERTIFICATES:
          case ActionType.UPGRADE_STATION:
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
      takeUntil(this.destroyed),
      take(1),
      switchMap(game => this.gameService.getState(game.id)))
      .subscribe(state => this.state.next(state));
  }

  cancelAction() {
    this.selectedAction = null;
  }

  private canPerformFreeAction(state: State) {
    return state.actions.some(action => FREE_ACTIONS.includes(action));
  }

}
