import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateLogoComponent } from './update-logo.component';

describe('UpdateLogoComponent', () => {
  let component: UpdateLogoComponent;
  let fixture: ComponentFixture<UpdateLogoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateLogoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
