import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignVendorRouteComponent } from './assign-vendor-route.component';

describe('AssignVendorRouteComponent', () => {
  let component: AssignVendorRouteComponent;
  let fixture: ComponentFixture<AssignVendorRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignVendorRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignVendorRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
