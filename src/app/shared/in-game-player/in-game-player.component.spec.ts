import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InGamePlayerComponent } from './in-game-player.component';

describe('InGamePlayerComponent', () => {
  let component: InGamePlayerComponent;
  let fixture: ComponentFixture<InGamePlayerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InGamePlayerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InGamePlayerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
