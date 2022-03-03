import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TilePopoverComponent } from './tile-popover.component';

describe('TilePopoverComponent', () => {
  let component: TilePopoverComponent;
  let fixture: ComponentFixture<TilePopoverComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TilePopoverComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TilePopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
