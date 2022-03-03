import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElementSpaceComponent } from './element-space.component';

describe('ElementSpaceComponent', () => {
  let component: ElementSpaceComponent;
  let fixture: ComponentFixture<ElementSpaceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ElementSpaceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ElementSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
