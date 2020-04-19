import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeepeeComponent } from './teepee.component';

describe('TeepeeComponent', () => {
  let component: TeepeeComponent;
  let fixture: ComponentFixture<TeepeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeepeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeepeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
