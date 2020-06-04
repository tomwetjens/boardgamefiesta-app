import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IstanbulBoardComponent } from './istanbul-board.component';

describe('BoardComponent', () => {
  let component: IstanbulBoardComponent;
  let fixture: ComponentFixture<IstanbulBoardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IstanbulBoardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IstanbulBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
