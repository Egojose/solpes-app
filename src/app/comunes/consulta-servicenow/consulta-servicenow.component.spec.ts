import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaServicenowComponent } from './consulta-servicenow.component';

describe('ConsultaServicenowComponent', () => {
  let component: ConsultaServicenowComponent;
  let fixture: ComponentFixture<ConsultaServicenowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConsultaServicenowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaServicenowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
