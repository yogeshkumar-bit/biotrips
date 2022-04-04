import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RemoveCabComponent } from './remove-cab.component';

describe('RemoveCabComponent', () => {
  let component: RemoveCabComponent;
  let fixture: ComponentFixture<RemoveCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RemoveCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RemoveCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
