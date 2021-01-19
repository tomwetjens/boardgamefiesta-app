import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LocationIconComponent } from './location-icon.component';

describe('LocationIconComponent', () => {
  let component: LocationIconComponent;
  let fixture: ComponentFixture<LocationIconComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationIconComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
