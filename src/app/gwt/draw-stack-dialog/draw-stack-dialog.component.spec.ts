import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrawStackDialogComponent } from './draw-stack-dialog.component';

describe('DrawStackDialogComponent', () => {
  let component: DrawStackDialogComponent;
  let fixture: ComponentFixture<DrawStackDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrawStackDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrawStackDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
