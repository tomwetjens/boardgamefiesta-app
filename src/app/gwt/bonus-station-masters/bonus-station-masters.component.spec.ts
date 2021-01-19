import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BonusStationMastersComponent } from './bonus-station-masters.component';

describe('BonusStationMastersComponent', () => {
  let component: BonusStationMastersComponent;
  let fixture: ComponentFixture<BonusStationMastersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BonusStationMastersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BonusStationMastersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
