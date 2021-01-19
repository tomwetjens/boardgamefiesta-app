import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { InGameNavbarComponent } from './in-game-navbar.component';

describe('InGameNavbarComponent', () => {
  let component: InGameNavbarComponent;
  let fixture: ComponentFixture<InGameNavbarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InGameNavbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InGameNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
