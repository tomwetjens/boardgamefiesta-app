import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DeliveryCityComponent} from './delivery-city.component';
import {City} from "../model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";

describe('DeliveryCityComponent', () => {
  let component: DeliveryCityComponent;
  let fixture: ComponentFixture<DeliveryCityComponent>;

  let ngbActiveModal: NgbActiveModal;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DeliveryCityComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: NgbActiveModal, useValue: ngbActiveModal}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryCityComponent);

    component = fixture.componentInstance;
    component.possibleDelivery = {city: City.SAN_DIEGO, certificates: 7, reward: -1};
    component.playerState = {tempCertificates: 6, certificates: 8} as any;

    fixture.detectChanges();
  });


  it('should calculate correctly', () => {
    component.possibleDelivery = {city: City.SAN_DIEGO, certificates: 7, reward: -1};
    component.playerState = {tempCertificates: 6, certificates: 8} as any;

    expect(component.perm).toEqual([]);
    expect(component.both).toEqual([
      {perm: 2, temp: 5},
      {perm: 2, temp: 6}
    ]);
  });

  it('should not allow spending 1 of 6 temp certs, since marker moves from 6 back to 4', () => {
    component.possibleDelivery = {city: City.KANSAS_CITY, certificates: 0, reward: 6};
    component.playerState = {tempCertificates: 6, certificates: 6} as any;

    expect(component.perm).toEqual([
      {perm: 0, temp: 0}
    ]);
    expect(component.both).toEqual([
      {perm: 0, temp: 2},
      {perm: 0, temp: 3},
      {perm: 0, temp: 4},
      {perm: 0, temp: 5},
      {perm: 0, temp: 6}
    ]);
  });
});
