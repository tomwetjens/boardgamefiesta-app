import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawBagComponent } from './draw-bag.component';

describe('DrawBagComponent', () => {
  let component: DrawBagComponent;
  let fixture: ComponentFixture<DrawBagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DrawBagComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawBagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
