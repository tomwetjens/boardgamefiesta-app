import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndedDialogComponent } from './ended-dialog.component';

describe('EndedDialogComponent', () => {
  let component: EndedDialogComponent;
  let fixture: ComponentFixture<EndedDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndedDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndedDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
