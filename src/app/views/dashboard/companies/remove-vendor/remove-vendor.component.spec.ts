import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveVendorComponent } from './remove-vendor.component';

describe('RemoveVendorComponent', () => {
  let component: RemoveVendorComponent;
  let fixture: ComponentFixture<RemoveVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
