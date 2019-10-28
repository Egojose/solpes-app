import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionErroresComponent } from './gestion-errores.component';

describe('GestionErroresComponent', () => {
  let component: GestionErroresComponent;
  let fixture: ComponentFixture<GestionErroresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionErroresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionErroresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
