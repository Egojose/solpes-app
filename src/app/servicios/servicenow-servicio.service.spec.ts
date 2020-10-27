import { TestBed } from '@angular/core/testing';

import { ServicenowServicioService } from './servicenow-servicio.service';

describe('ServicenowServicioService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicenowServicioService = TestBed.get(ServicenowServicioService);
    expect(service).toBeTruthy();
  });
});
