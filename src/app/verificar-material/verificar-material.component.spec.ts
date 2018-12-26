import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerificarMaterialComponent } from './verificar-material.component';

describe('VerificarMaterialComponent', () => {
  let component: VerificarMaterialComponent;
  let fixture: ComponentFixture<VerificarMaterialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerificarMaterialComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerificarMaterialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
