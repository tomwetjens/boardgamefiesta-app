import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DiscardPileDialogComponent } from './discard-pile-dialog.component';

describe('DiscardPileDialogComponent', () => {
  let component: DiscardPileDialogComponent;
  let fixture: ComponentFixture<DiscardPileDialogComponent>;

  beforeEach(waitForAsync(() => {
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
