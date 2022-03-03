import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitiativeMarkerComponent } from './initiative-marker.component';

describe('InitiativeMarkerComponent', () => {
  let component: InitiativeMarkerComponent;
  let fixture: ComponentFixture<InitiativeMarkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InitiativeMarkerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InitiativeMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
