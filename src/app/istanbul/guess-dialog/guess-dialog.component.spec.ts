import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GuessDialogComponent } from './guess-dialog.component';

describe('GuessDialogComponent', () => {
  let component: GuessDialogComponent;
  let fixture: ComponentFixture<GuessDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GuessDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuessDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
