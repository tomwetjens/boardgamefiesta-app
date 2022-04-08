import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TundraTilesComponent } from './tundra-tiles.component';

describe('TundraTilesComponent', () => {
  let component: TundraTilesComponent;
  let fixture: ComponentFixture<TundraTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TundraTilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TundraTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
