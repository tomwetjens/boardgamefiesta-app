import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GwtBoardComponent } from './gwt-board.component';

describe('BoardComponent', () => {
  let component: GwtBoardComponent;
  let fixture: ComponentFixture<GwtBoardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GwtBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GwtBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
