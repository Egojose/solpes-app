import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EntregaBienesComponent } from './entrega-bienes.component';

describe('EntregaBienesComponent', () => {
  let component: EntregaBienesComponent;
  let fixture: ComponentFixture<EntregaBienesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EntregaBienesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EntregaBienesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
