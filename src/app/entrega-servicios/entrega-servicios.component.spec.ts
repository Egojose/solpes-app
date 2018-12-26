import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaServiciosComponent } from './entrega-servicios.component';

describe('EntregaServiciosComponent', () => {
  let component: EntregaServiciosComponent;
  let fixture: ComponentFixture<EntregaServiciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregaServiciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregaServiciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
