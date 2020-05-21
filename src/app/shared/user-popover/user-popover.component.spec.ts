import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPopoverComponent } from './user-popover.component';

describe('PlayerPopoverComponent', () => {
  let component: UserPopoverComponent;
  let fixture: ComponentFixture<UserPopoverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
