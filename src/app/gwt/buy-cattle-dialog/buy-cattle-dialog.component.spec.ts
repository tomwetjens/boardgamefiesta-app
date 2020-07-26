import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyCattleDialogComponent } from './buy-cattle-dialog.component';

describe('BuyCattleDialogComponent', () => {
  let component: BuyCattleDialogComponent;
  let fixture: ComponentFixture<BuyCattleDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BuyCattleDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyCattleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
