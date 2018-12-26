import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarSolicitudesComponent } from './consultar-solicitudes.component';

describe('ConsultarSolicitudesComponent', () => {
  let component: ConsultarSolicitudesComponent;
  let fixture: ComponentFixture<ConsultarSolicitudesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultarSolicitudesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultarSolicitudesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
