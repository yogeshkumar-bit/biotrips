import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CabsComponent } from './cabs.component';

describe('CabsComponent', () => {
  let component: CabsComponent;
  let fixture: ComponentFixture<CabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
