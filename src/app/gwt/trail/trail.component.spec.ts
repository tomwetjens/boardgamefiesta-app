import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrailComponent } from './trail.component';

describe('TrailComponent', () => {
  let component: TrailComponent;
  let fixture: ComponentFixture<TrailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
