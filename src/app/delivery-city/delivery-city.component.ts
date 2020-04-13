import {Component, Input, OnInit} from '@angular/core';
import {PlayerState, PossibleDelivery} from '../model';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-delivery-city',
  templateUrl: './delivery-city.component.html',
  styleUrls: ['./delivery-city.component.scss']
})
export class DeliveryCityComponent implements OnInit {

  @Input() playerState: PlayerState;
  @Input() possibleDelivery: PossibleDelivery;

  certificates = 0;

  constructor(public ngbActiveModal: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  confirm() {
    this.ngbActiveModal.close({certificates: this.certificates});
  }

  get reward(): number {
    console.log(this.possibleDelivery.reward);
    return this.possibleDelivery.reward + (this.certificates - this.possibleDelivery.certificates);
  }
}
