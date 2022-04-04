import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteCabComponent } from './delete-cab.component';

describe('DeleteCabComponent', () => {
  let component: DeleteCabComponent;
  let fixture: ComponentFixture<DeleteCabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteCabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteCabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
