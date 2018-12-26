import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SondeoComponent } from './sondeo.component';

describe('SondeoComponent', () => {
  let component: SondeoComponent;
  let fixture: ComponentFixture<SondeoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SondeoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SondeoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
