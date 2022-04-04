import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockedCabModalComponent } from './blocked-cab-modal.component';

describe('BlockedCabModalComponent', () => {
  let component: BlockedCabModalComponent;
  let fixture: ComponentFixture<BlockedCabModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockedCabModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockedCabModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
