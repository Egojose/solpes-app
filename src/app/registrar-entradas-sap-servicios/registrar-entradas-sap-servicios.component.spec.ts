import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarEntradasSapServiciosComponent } from './registrar-entradas-sap-servicios.component';

describe('RegistrarEntradasSapServiciosComponent', () => {
  let component: RegistrarEntradasSapServiciosComponent;
  let fixture: ComponentFixture<RegistrarEntradasSapServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarEntradasSapServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarEntradasSapServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
