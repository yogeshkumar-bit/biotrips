import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportPreviewComponent } from './export-preview.component';

describe('ExportPreviewComponent', () => {
  let component: ExportPreviewComponent;
  let fixture: ComponentFixture<ExportPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
