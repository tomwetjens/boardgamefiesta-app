import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementPopoverComponent } from './element-popover.component';

describe('ElementPopoverComponent', () => {
  let component: ElementPopoverComponent;
  let fixture: ComponentFixture<ElementPopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementPopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
