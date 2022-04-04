import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleShiftComponent } from './single-shift.component';

describe('SingleShiftComponent', () => {
  let component: SingleShiftComponent;
  let fixture: ComponentFixture<SingleShiftComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleShiftComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleShiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
