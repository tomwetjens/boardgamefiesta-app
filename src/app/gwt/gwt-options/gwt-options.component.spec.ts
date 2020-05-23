import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GwtOptionsComponent } from './gwt-options.component';

describe('GwtOptionsComponent', () => {
  let component: GwtOptionsComponent;
  let fixture: ComponentFixture<GwtOptionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GwtOptionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GwtOptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
