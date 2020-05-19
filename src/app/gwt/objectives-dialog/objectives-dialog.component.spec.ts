import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObjectivesDialogComponent } from './objectives-dialog.component';

describe('ObjectivesDialogComponent', () => {
  let component: ObjectivesDialogComponent;
  let fixture: ComponentFixture<ObjectivesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObjectivesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObjectivesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
