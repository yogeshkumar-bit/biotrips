import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCabComponent } from './single-cab.component';

describe('SingleCabComponent', () => {
  let component: SingleCabComponent;
  let fixture: ComponentFixture<SingleCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
