import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MoveEmployeeComponent } from './move-employee.component';

describe('MoveComponentComponent', () => {
  let component: MoveEmployeeComponent;
  let fixture: ComponentFixture<MoveEmployeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MoveEmployeeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MoveEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
