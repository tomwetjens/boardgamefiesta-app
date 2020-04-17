import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable, ReplaySubject} from 'rxjs';
import {filter, flatMap, switchMap, take} from 'rxjs/operators';
import {Action, ActionType, Game, PossibleMove, State} from '../model';
import {EventService} from '../event.service';
import {GameService} from '../game.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

const AUTO_SELECTED_ACTIONS = [
  ActionType.MOVE,
  ActionType.DISCARD_CARD,
  ActionType.CHOOSE_FORESIGHTS,
  ActionType.DELIVER_TO_CITY,
  ActionType.UNLOCK_WHITE,
  ActionType.UNLOCK_BLACK_OR_WHITE,
  ActionType.DOWNGRADE_STATION
];

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game = new ReplaySubject<Game>(1);
  state = new ReplaySubject<State>(1);

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
      if (state.turn && state.actions.length === 1 && AUTO_SELECTED_ACTIONS.includes(state.actions[0])) {
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
      take(1),
      switchMap(game => this.gameService.getState(game.id)))
      .subscribe(state => this.state.next(state));
  }

  cancelAction() {
    this.selectedAction = null;
  }
}
