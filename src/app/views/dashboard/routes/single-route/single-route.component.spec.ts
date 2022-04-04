import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleRouteComponent } from './single-route.component';

describe('SingleRouteComponent', () => {
  let component: SingleRouteComponent;
  let fixture: ComponentFixture<SingleRouteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleRouteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
