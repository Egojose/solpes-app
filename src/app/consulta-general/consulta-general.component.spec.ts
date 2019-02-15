import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaGeneralComponent } from './consulta-general.component';

describe('ConsultaGeneralComponent', () => {
  let component: ConsultaGeneralComponent;
  let fixture: ComponentFixture<ConsultaGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
