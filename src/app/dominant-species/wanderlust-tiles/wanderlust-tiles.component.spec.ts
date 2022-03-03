import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WanderlustTilesComponent } from './wanderlust-tiles.component';

describe('WanderlustTilesComponent', () => {
  let component: WanderlustTilesComponent;
  let fixture: ComponentFixture<WanderlustTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WanderlustTilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WanderlustTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
