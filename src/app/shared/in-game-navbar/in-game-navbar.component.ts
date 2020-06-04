import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Table} from '../model';

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

  constructor() {
  }

  ngOnInit(): void {
  }

}
