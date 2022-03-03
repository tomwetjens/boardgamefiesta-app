import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScoringTableComponent } from './scoring-table.component';

describe('ScoringTableComponent', () => {
  let component: ScoringTableComponent;
  let fixture: ComponentFixture<ScoringTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ScoringTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoringTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
