import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationIconComponent } from './location-icon.component';

describe('LocationIconComponent', () => {
  let component: LocationIconComponent;
  let fixture: ComponentFixture<LocationIconComponent>;

  beforeEach(async(() => {
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
