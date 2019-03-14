import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportarSolicitudComponent } from './reportar-solicitud.component';

describe('ReportarSolicitudComponent', () => {
  let component: ReportarSolicitudComponent;
  let fixture: ComponentFixture<ReportarSolicitudComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportarSolicitudComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportarSolicitudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
