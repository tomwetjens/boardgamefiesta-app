import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HazardPopoverComponent } from './hazard-popover.component';

describe('HazardPopoverComponent', () => {
  let component: HazardPopoverComponent;
  let fixture: ComponentFixture<HazardPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HazardPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HazardPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
