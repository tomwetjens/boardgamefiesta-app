import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryCityComponent } from './delivery-city.component';

describe('DeliveryCityComponent', () => {
  let component: DeliveryCityComponent;
  let fixture: ComponentFixture<DeliveryCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeliveryCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeliveryCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
