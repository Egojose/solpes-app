import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSolicitudTabComponent } from './ver-solicitud-tab.component';

describe('VerSolicitudTabComponent', () => {
  let component: VerSolicitudTabComponent;
  let fixture: ComponentFixture<VerSolicitudTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerSolicitudTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerSolicitudTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
