import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GwtComponent } from './gwt.component';

describe('GwtComponent', () => {
  let component: GwtComponent;
  let fixture: ComponentFixture<GwtComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GwtComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GwtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
