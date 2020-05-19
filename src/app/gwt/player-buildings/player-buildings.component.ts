import {Component, Input, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {Table} from '../../shared/model';
import {PlayerState} from '../model';

@Component({
  selector: 'app-player-buildings',
  templateUrl: './player-buildings.component.html',
  styleUrls: ['./player-buildings.component.scss']
})
export class PlayerBuildingsComponent implements OnInit {

  @Input() table: Table;
  @Input() playerState: PlayerState;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  confirm(playerBuilding: string) {
    this.ngbActiveModal.close(playerBuilding);
  }
}
