import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AprobarSondeoComponent } from './aprobar-sondeo.component';

describe('AprobarSondeoComponent', () => {
  let component: AprobarSondeoComponent;
  let fixture: ComponentFixture<AprobarSondeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AprobarSondeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AprobarSondeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
