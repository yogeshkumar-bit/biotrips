import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCabComponent } from './assign-cab.component';

describe('AssignCabComponent', () => {
  let component: AssignCabComponent;
  let fixture: ComponentFixture<AssignCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
