import { TestBed } from '@angular/core/testing';

import { DefaultInterceptorService } from './default-interceptor.service';

describe('DefaultInterceptorService', () => {
  let service: DefaultInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
