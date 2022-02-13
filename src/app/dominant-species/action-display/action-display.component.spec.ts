import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDisplayComponent } from './action-display.component';

describe('ActionDisplayComponent', () => {
  let component: ActionDisplayComponent;
  let fixture: ComponentFixture<ActionDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionDisplayComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActionDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
