import {Component, Input, OnInit} from '@angular/core';
import {PlayerState, PossibleDelivery} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

interface Option {
  perm: number;
  temp: number;
}

@Component({
  selector: 'app-delivery-city',
  templateUrl: './delivery-city.component.html',
  styleUrls: ['./delivery-city.component.scss']
})
export class DeliveryCityComponent implements OnInit {

  @Input() playerState: PlayerState;
  @Input() possibleDelivery: PossibleDelivery;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  get perm(): Option[] {
    return Array(this.playerState.certificates - this.playerState.tempCertificates + 1)
      .fill(0)
      .map((_, index) => index)
      .filter(perm => perm >= this.possibleDelivery.certificates)
      .map(perm => ({perm, temp: 0}));
  }

  get both(): Option[] {
    const perm = this.playerState.certificates - this.playerState.tempCertificates;

    return Array(this.playerState.tempCertificates)
      .fill(0)
      .map((_, index) => index + 1)
      .filter(temp => temp !== 5)
      .filter(temp => perm + temp >= this.possibleDelivery.certificates)
      .map(temp => ({perm, temp}));
  }

}
