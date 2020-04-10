import {Component, Input, OnInit} from '@angular/core';
import {PlayerState, Unlockable} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delivery-city',
  templateUrl: './delivery-city.component.html',
  styleUrls: ['./delivery-city.component.scss']
})
export class DeliveryCityComponent implements OnInit {

  @Input() playerState: PlayerState;
  @Input() city: string;

  unlockables: Unlockable[] = [
    Unlockable.AUX_DRAW_CARD_TO_DISCARD_CARD,
    Unlockable.AUX_GAIN_DOLLAR,
    Unlockable.AUX_MOVE_ENGINE_BACKWARDS_TO_GAIN_CERT,
    Unlockable.AUX_MOVE_ENGINE_BACKWARDS_TO_REMOVE_CARD,
    Unlockable.AUX_PAY_TO_MOVE_ENGINE_FORWARD,
    Unlockable.EXTRA_CARD,
    Unlockable.EXTRA_STEP_DOLLARS,
    Unlockable.EXTRA_STEP_POINTS,
    Unlockable.CERT_LIMIT_4,
    Unlockable.CERT_LIMIT_6
  ];

  certificates = 0;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  confirm(certificates: number, unlock: Unlockable) {
    console.log('confirm: ', {certificates, unlock});
    this.ngbActiveModal.close({certificates, unlock});
  }
}
