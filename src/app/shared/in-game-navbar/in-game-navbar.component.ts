import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table} from '../model';
import {AudioService} from "../../audio.service";
import {TableService} from "../../table.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-in-game-navbar',
  templateUrl: './in-game-navbar.component.html',
  styleUrls: ['./in-game-navbar.component.scss']
})
export class InGameNavbarComponent implements OnInit {

  @Input() table: Table;

  // TODO Should read this from table
  @Input() canSkip: boolean;

  @Input() busy: boolean;

  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  connected$: Observable<boolean>;

  constructor(private audioService: AudioService,
              private tableService: TableService) {
    this.connected$ = this.tableService.connected$;
  }

  get muted(): boolean {
    return this.audioService.muted;
  }

  ngOnInit(): void {
  }

  mute() {
    this.audioService.mute();
  }

  unmute() {
    this.audioService.unmute();
  }
}
