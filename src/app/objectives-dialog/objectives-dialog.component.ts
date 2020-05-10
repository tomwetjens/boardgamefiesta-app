import {Component, Input, OnInit} from '@angular/core';
import {Game, PlayerState} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-objectives-dialog',
  templateUrl: './objectives-dialog.component.html',
  styleUrls: ['./objectives-dialog.component.scss']
})
export class ObjectivesDialogComponent implements OnInit {

  @Input() game: Game;
  @Input() playerState: PlayerState;

  constructor(public ngbActiveModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
