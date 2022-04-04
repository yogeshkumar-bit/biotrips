import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AlreadyEmployeeComponent } from './already-employee.component';

describe('AlreadyEmployeeComponent', () => {
  let component: AlreadyEmployeeComponent;
  let fixture: ComponentFixture<AlreadyEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AlreadyEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AlreadyEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
