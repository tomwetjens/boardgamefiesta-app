import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HazardComponent } from './hazard.component';

describe('HazardComponent', () => {
  let component: HazardComponent;
  let fixture: ComponentFixture<HazardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HazardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
