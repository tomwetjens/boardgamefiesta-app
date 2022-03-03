import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodChainComponent } from './food-chain.component';

describe('FoodChainComponent', () => {
  let component: FoodChainComponent;
  let fixture: ComponentFixture<FoodChainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FoodChainComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodChainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
