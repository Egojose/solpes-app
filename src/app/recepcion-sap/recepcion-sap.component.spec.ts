import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecepcionSapComponent } from './recepcion-sap.component';

describe('RecepcionSapComponent', () => {
  let component: RecepcionSapComponent;
  let fixture: ComponentFixture<RecepcionSapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecepcionSapComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecepcionSapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
