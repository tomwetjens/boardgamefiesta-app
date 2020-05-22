import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardFactoryComponent } from './board-factory.component';

describe('BoardComponent', () => {
  let component: BoardFactoryComponent;
  let fixture: ComponentFixture<BoardFactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BoardFactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BoardFactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
