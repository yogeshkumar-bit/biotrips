import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePaymentComponent } from './delete-payment.component';

describe('DeletePaymentComponent', () => {
  let component: DeletePaymentComponent;
  let fixture: ComponentFixture<DeletePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeletePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
