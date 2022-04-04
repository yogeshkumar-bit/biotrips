import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCabComponent } from './create-cab.component';

describe('CreateCabComponent', () => {
  let component: CreateCabComponent;
  let fixture: ComponentFixture<CreateCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
