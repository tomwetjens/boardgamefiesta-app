import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CattleMarketComponent } from './cattle-market.component';

describe('CattleMarketComponent', () => {
  let component: CattleMarketComponent;
  let fixture: ComponentFixture<CattleMarketComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CattleMarketComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CattleMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
