import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarSolpSapComponent } from './registrar-solp-sap.component';

describe('RegistrarSolpSapComponent', () => {
  let component: RegistrarSolpSapComponent;
  let fixture: ComponentFixture<RegistrarSolpSapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarSolpSapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarSolpSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
