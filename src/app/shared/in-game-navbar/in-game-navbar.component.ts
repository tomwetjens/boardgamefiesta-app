/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Table} from '../model';
import {AudioService} from "../../audio.service";
import {TableService} from "../../table.service";
import {interval, Observable, Subject, Subscription, timer} from "rxjs";
import moment from "moment";
import {distinctUntilChanged, map, shareReplay, takeUntil} from "rxjs/operators";
import {MessageDialogComponent} from "../message-dialog/message-dialog.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-in-game-navbar',
  templateUrl: './in-game-navbar.component.html',
  styleUrls: ['./in-game-navbar.component.scss']
})
export class InGameNavbarComponent implements OnInit, OnChanges, OnDestroy {

  private destroyed = new Subject();

  @Input() table: Table;

  // TODO Should read this from table
  @Input() canSkip: boolean;

  @Input() busy: boolean;
  @Input() autoEndTurn = false;
  @Input() autoEndTurnSecs = 30;

  autoEndTurnTimer: Subscription;
  autoEndTurnInSecs: number;

  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  connected$: Observable<boolean>;

  afterTurnLimit$: Observable<boolean>;
  canKick$: Observable<boolean>;
  canForceEndTurn$: Observable<boolean>;

  constructor(private ngZone: NgZone,
              private audioService: AudioService,
              private tableService: TableService,
              private ngbModal: NgbModal) {
  }

  get muted(): boolean {
    return this.audioService.muted;
  }

  ngOnInit(): void {
    this.connected$ = this.tableService.connected$;

    this.afterTurnLimit$ = timer(0, 1000)
      .pipe(
        takeUntil(this.destroyed),
        map(() => {
          if (this.table
            && this.table.players[this.table.currentPlayer]) {
            const turnLimit = moment(this.table.players[this.table.currentPlayer].turnLimit);
            const now = moment();
            return now.isAfter(turnLimit);
          }
          return false;
        }),
        distinctUntilChanged(),
        shareReplay(1)
      );

    this.canForceEndTurn$ = this.afterTurnLimit$
      .pipe(
        takeUntil(this.destroyed),
        map(afterTurnLimit => afterTurnLimit
          && this.table
          && !!this.table.player/* Not spectator */),
        distinctUntilChanged(),
        shareReplay(1)
      );

    this.canKick$ = this.afterTurnLimit$
      .pipe(
        takeUntil(this.destroyed),
        map(afterTurnLimit => afterTurnLimit
          && this.table
          && !!this.table.player/* Not spectator */
          && this.table.players[this.table.currentPlayer].canKickAfterTurnLimit),
        distinctUntilChanged(),
        shareReplay(1)
      );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.autoEndTurn) {
      if (this.autoEndTurn) {
        if (!this.autoEndTurnTimer) {
          this.startAutoEndTurnTimer();
        }
      } else {
        if (this.autoEndTurnTimer) {
          this.stopAutoEndTurnTimer();
        }
      }
    }
  }

  private stopAutoEndTurnTimer() {
    if (this.autoEndTurnTimer) {
      if (!this.autoEndTurnTimer.closed) {
        this.autoEndTurnTimer.unsubscribe();
      }
      this.autoEndTurnTimer = null;
      this.autoEndTurnInSecs = null;
    }
  }

  private startAutoEndTurnTimer() {
    if (!this.autoEndTurnTimer || this.autoEndTurnTimer.closed) {
      this.autoEndTurnInSecs = this.autoEndTurnSecs;
      this.autoEndTurnTimer = interval(1000)
        .pipe(takeUntil(this.destroyed))
        .subscribe(() => {
          this.ngZone.run(() => {
            this.autoEndTurnInSecs--;

            if (this.autoEndTurnInSecs === 0) {
              this.stopAutoEndTurnTimer();

              // Extra safety check, in case timer was not cancelled in time
              if (!this.table.ended && this.table.turn) {
                this.endTurn.emit();
              }
            }
          });
        });
    }
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  mute() {
    this.audioService.mute();
  }

  unmute() {
    this.audioService.unmute();
  }

  doKick() {
    const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
    const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
    messageDialogComponent.type = 'confirm';
    messageDialogComponent.messageKey = 'confirmKick';
    messageDialogComponent.confirmKey = 'kick';
    messageDialogComponent.cancelKey = 'cancel';
    fromPromise(ngbModalRef.result)
      .subscribe(() => this.tableService.kick(this.table.id, this.table.currentPlayer).subscribe());
  }

  doForceEndTurn() {
    const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
    const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
    messageDialogComponent.type = 'confirm';
    messageDialogComponent.messageKey = 'confirmForceEndTurn';
    messageDialogComponent.confirmKey = 'forceEndTurn';
    messageDialogComponent.cancelKey = 'cancel';
    fromPromise(ngbModalRef.result)
      .subscribe(() => this.tableService.forceEndTurn(this.table.id, this.table.currentPlayer).subscribe());
  }
}
