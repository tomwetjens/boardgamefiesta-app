import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectiveCardsComponent } from './objective-cards.component';

describe('ObjectiveCardsComponent', () => {
  let component: ObjectiveCardsComponent;
  let fixture: ComponentFixture<ObjectiveCardsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectiveCardsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectiveCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
