import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InGameNavbarComponent } from './in-game-navbar.component';

describe('InGameNavbarComponent', () => {
  let component: InGameNavbarComponent;
  let fixture: ComponentFixture<InGameNavbarComponent>;

  beforeEach(async(() => {
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
