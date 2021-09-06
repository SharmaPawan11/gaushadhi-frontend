import { TestBed } from '@angular/core/testing';

import { RequestorService } from './requestor.service';

describe('RequestorService', () => {
  let service: RequestorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequestorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
