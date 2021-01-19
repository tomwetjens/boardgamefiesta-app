import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BuildingPopoverComponent } from './building-popover.component';

describe('BuildingPopoverComponent', () => {
  let component: BuildingPopoverComponent;
  let fixture: ComponentFixture<BuildingPopoverComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BuildingPopoverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuildingPopoverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
