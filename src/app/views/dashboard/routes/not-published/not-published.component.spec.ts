import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotPublishedComponent } from './not-published.component';

describe('NotPublishedComponent', () => {
  let component: NotPublishedComponent;
  let fixture: ComponentFixture<NotPublishedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotPublishedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotPublishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
