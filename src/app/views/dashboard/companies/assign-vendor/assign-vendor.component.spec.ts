import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVendorComponent } from './assign-vendor.component';

describe('AssignVendorComponent', () => {
  let component: AssignVendorComponent;
  let fixture: ComponentFixture<AssignVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
