import {Component, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {of, ReplaySubject, Subject} from 'rxjs';
import {map, switchMap, take, takeUntil} from 'rxjs/operators';
import {Action, ActionType, EventType, PlayerStatus, State, Table, TablePlayer, TableStatus} from '../model';
import {EventService} from '../event.service';
import {TableService} from '../table.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {AudioService} from '../audio.service';
import {EndedDialogComponent} from '../ended-dialog/ended-dialog.component';
import {MessageDialogComponent} from '../message-dialog/message-dialog.component';
import {fromPromise} from 'rxjs/internal-compatibility';
import {SelectUserComponent} from "../select-user/select-user.component";

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
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnDestroy, OnChanges {

  private destroyed = new Subject();

  table = new ReplaySubject<Table>(1);
  state = new ReplaySubject<State>(1);

  selectedAction: ActionType;

  constructor(private route: ActivatedRoute,
              private tableService: TableService,
              private eventService: EventService,
              private ngbModal: NgbModal,
              private audioService: AudioService) {

  }

  ngOnInit(): void {
    this.refreshTable();

    this.table
      .pipe(takeUntil(this.destroyed))
      .subscribe(table => {
        if (table.status === TableStatus.STARTED || table.status === TableStatus.ENDED) {
          this.refreshState();
        }

        if (table.status === TableStatus.ENDED) {
          const ngbModalRef = this.ngbModal.open(EndedDialogComponent);
          ngbModalRef.componentInstance.table = table;
        }
      });

    this.eventService.events
      .pipe(takeUntil(this.destroyed))
      // TODO Filter on current table
      .subscribe(event => {
        switch (event.type) {
          case EventType.ACCEPTED:
          case EventType.REJECTED:
          case EventType.STARTED:
          case EventType.ENDED:
          case EventType.INVITED:
          case EventType.UNINVITED:
          case EventType.PROPOSED_TO_LEAVE:
          case EventType.AGREED_TO_LEAVE:
          case EventType.LEFT:
          case EventType.ABANDONED:
            this.refreshTable();
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

  private refreshTable() {
    this.route.params
      .pipe(switchMap(params => this.tableService.get(params.id)))
      .subscribe(table => this.table.next(table));
  }

  start() {
    this.table
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(table => {
          if (this.hasInvitedPlayers(table)) {
            const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
            ngbModalRef.componentInstance.message = 'Some players have not yet responded. They will not be able to join the table. Do you still want to start the table?';
            ngbModalRef.componentInstance.confirm = 'START';
            ngbModalRef.componentInstance.cancel = 'WAIT_FOR_PLAYERS';
            return fromPromise(ngbModalRef.result)
              .pipe(map(() => table));
          }
          return of(table);
        }),
        switchMap(table => this.tableService.start(table.id)))
      .subscribe();
  }

  private hasInvitedPlayers(table: Table) {
    return table.players[table.player].status === PlayerStatus.INVITED
      || table.otherPlayers.some(name => table.players[name].status === PlayerStatus.INVITED);
  }

  perform(action: Action) {
    this.table
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(table => this.tableService.perform(table.id, action)))
      .subscribe(state => {
        this.selectedAction = null;
        this.state.next(state);
      });
  }

  skipAction() {
    this.table
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(table => this.tableService.skip(table.id)))
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
        switchMap(() => this.table),
        take(1),
        switchMap(table => this.tableService.endTurn(table.id)))
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
    this.table.pipe(
      takeUntil(this.destroyed),
      take(1),
      switchMap(table => this.tableService.getState(table.id)))
      .subscribe(state => this.state.next(state));
  }

  cancelAction() {
    this.selectedAction = null;
  }

  private canPerformFreeAction(state: State) {
    return state.actions.some(action => FREE_ACTIONS.includes(action));
  }

  canSkip(state: State) {
    return state.turn && state.actions.length === 1 && state.actions[0] !== ActionType.PLAY_OBJECTIVE_CARD;
  }

  abandon() {
    this.table
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(table => this.tableService.abandon(table.id)))
      .subscribe();
  }

  leave() {
    this.table
      .pipe(
        takeUntil(this.destroyed),
        take(1),
        switchMap(table => this.tableService.leave(table.id)))
      .subscribe();
  }

  invite() {
    this.table.pipe(
      takeUntil(this.destroyed),
      take(1),
      switchMap(table => {
        const ngbModalRef = this.ngbModal.open(SelectUserComponent);
        return fromPromise(ngbModalRef.result)
          .pipe(switchMap(user => this.tableService.invite(table.id, user.id)));
      }))
      .subscribe(() => this.refreshTable());
  }

  addComputer() {
    this.table.pipe(
      takeUntil(this.destroyed),
      take(1),
      switchMap(table => this.tableService.addComputer(table.id)))
      .subscribe(() => this.refreshTable());
  }

  kick(player: TablePlayer) {
    this.table.pipe(
      takeUntil(this.destroyed),
      take(1),
      switchMap(table => this.tableService.kick(table.id, player.id)))
      .subscribe(() => this.refreshTable());
  }

  accept() {
    this.table.pipe(
      takeUntil(this.destroyed),
      take(1),
      switchMap(table => this.tableService.accept(table.id)))
      .subscribe(() => this.refreshTable());
  }

  reject() {
    this.table.pipe(
      takeUntil(this.destroyed),
      take(1),
      switchMap(table => this.tableService.reject(table.id)))
      .subscribe(() => this.refreshTable());
  }
}
