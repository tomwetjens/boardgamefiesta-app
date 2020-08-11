import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table} from '../model';
import {AudioService} from "../../audio.service";

@Component({
  selector: 'app-in-game-navbar',
  templateUrl: './in-game-navbar.component.html',
  styleUrls: ['./in-game-navbar.component.scss']
})
export class InGameNavbarComponent implements OnInit {

  @Input() table: Table;

  @Input() actions: string[];
  @Input() selectedAction: string;
  @Input() canSkip: boolean;

  @Output() perform = new EventEmitter<string>();
  @Output() skip = new EventEmitter<void>();
  @Output() endTurn = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() undo = new EventEmitter<void>();

  constructor(private audioService: AudioService) {

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
