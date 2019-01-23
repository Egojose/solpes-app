import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistroActivosComponent } from './registro-activos.component';

describe('RegistroActivosComponent', () => {
  let component: RegistroActivosComponent;
  let fixture: ComponentFixture<RegistroActivosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistroActivosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistroActivosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
