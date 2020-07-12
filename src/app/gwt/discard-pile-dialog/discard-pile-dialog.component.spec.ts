import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscardPileDialogComponent } from './discard-pile-dialog.component';

describe('DiscardPileDialogComponent', () => {
  let component: DiscardPileDialogComponent;
  let fixture: ComponentFixture<DiscardPileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscardPileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscardPileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
