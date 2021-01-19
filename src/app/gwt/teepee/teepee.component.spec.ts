import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TeepeeComponent } from './teepee.component';

describe('TeepeeComponent', () => {
  let component: TeepeeComponent;
  let fixture: ComponentFixture<TeepeeComponent>;

  beforeEach(waitForAsync(() => {
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
