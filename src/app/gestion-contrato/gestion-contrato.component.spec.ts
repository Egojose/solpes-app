import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionContratoComponent } from './gestion-contrato.component';

describe('GestionContratoComponent', () => {
  let component: GestionContratoComponent;
  let fixture: ComponentFixture<GestionContratoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionContratoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionContratoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
