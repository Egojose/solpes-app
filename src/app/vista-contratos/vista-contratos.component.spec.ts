import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VistaContratosComponent } from './vista-contratos.component';

describe('VistaContratosComponent', () => {
  let component: VistaContratosComponent;
  let fixture: ComponentFixture<VistaContratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VistaContratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
