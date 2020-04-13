import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CattleMarketComponent } from './cattle-market.component';

describe('CattleMarketComponent', () => {
  let component: CattleMarketComponent;
  let fixture: ComponentFixture<CattleMarketComponent>;

  beforeEach(async(() => {
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
