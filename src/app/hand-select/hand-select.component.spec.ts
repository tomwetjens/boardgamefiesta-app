import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HandSelectComponent } from './hand-select.component';

describe('HandSelectComponent', () => {
  let component: HandSelectComponent;
  let fixture: ComponentFixture<HandSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HandSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HandSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
