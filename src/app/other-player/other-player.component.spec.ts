import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherPlayerComponent } from './other-player.component';

describe('OtherPlayerComponent', () => {
  let component: OtherPlayerComponent;
  let fixture: ComponentFixture<OtherPlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OtherPlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OtherPlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
