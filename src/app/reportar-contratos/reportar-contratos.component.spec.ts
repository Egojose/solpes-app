import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportarContratosComponent } from './reportar-contratos.component';

describe('ReportarContratosComponent', () => {
  let component: ReportarContratosComponent;
  let fixture: ComponentFixture<ReportarContratosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportarContratosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
