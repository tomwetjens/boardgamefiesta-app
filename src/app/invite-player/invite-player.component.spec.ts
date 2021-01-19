import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InvitePlayerComponent } from './invite-player.component';

describe('InvitePlayerComponent', () => {
  let component: InvitePlayerComponent;
  let fixture: ComponentFixture<InvitePlayerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InvitePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
