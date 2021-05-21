import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {Table} from '../model';
import {AudioService} from "../../audio.service";
import {TableService} from "../../table.service";
import {Observable, Subject, timer} from "rxjs";
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
export class InGameNavbarComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  @Input() table: Table;

  // TODO Should read this from table
  @Input() canSkip: boolean;

  @Input() busy: boolean;

  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  connected$: Observable<boolean>;

  canKick$: Observable<boolean>;

  constructor(private audioService: AudioService,
              private tableService: TableService,
              private ngbModal: NgbModal) {
  }

  get muted(): boolean {
    return this.audioService.muted;
  }

  ngOnInit(): void {
    this.connected$ = this.tableService.connected$;

    this.canKick$ = timer(0, 1000)
      .pipe(
        takeUntil(this.destroyed),
        map(() => {
          if (this.table
            && !!this.table.player // Not spectator
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
}
