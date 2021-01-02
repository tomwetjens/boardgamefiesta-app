import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BonusStationMastersComponent } from './bonus-station-masters.component';

describe('BonusStationMastersComponent', () => {
  let component: BonusStationMastersComponent;
  let fixture: ComponentFixture<BonusStationMastersComponent>;

  beforeEach(async(() => {
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
