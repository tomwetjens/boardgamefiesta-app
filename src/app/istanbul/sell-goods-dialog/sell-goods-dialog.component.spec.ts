import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellGoodsDialogComponent } from './sell-goods-dialog.component';

describe('SellGoodsDialogComponent', () => {
  let component: SellGoodsDialogComponent;
  let fixture: ComponentFixture<SellGoodsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellGoodsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellGoodsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
