import { TestBed } from '@angular/core/testing';

import { SapService } from './sap.service';

describe('SapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SapService = TestBed.get(SapService);
    expect(service).toBeTruthy();
  });
});
