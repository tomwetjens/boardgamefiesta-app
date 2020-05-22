import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GwtBoardComponent } from './gwt-board.component';

describe('BoardComponent', () => {
  let component: GwtBoardComponent;
  let fixture: ComponentFixture<GwtBoardComponent>;

  beforeEach(async(() => {
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
