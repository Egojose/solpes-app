import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarFirmarContratoComponent } from './verificar-firmar-contrato.component';

describe('VerificarFirmarContratoComponent', () => {
  let component: VerificarFirmarContratoComponent;
  let fixture: ComponentFixture<VerificarFirmarContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificarFirmarContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarFirmarContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
