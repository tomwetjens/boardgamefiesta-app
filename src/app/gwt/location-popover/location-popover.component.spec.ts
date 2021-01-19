import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationPopoverComponent } from './location-popover.component';

describe('LocationPopoverComponent', () => {
  let component: LocationPopoverComponent;
  let fixture: ComponentFixture<LocationPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
