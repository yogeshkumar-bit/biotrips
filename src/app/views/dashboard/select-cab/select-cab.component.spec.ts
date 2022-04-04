import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCabComponent } from './select-cab.component';

describe('SelectCabComponent', () => {
  let component: SelectCabComponent;
  let fixture: ComponentFixture<SelectCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
