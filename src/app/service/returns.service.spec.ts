import { TestBed, inject } from '@angular/core/testing';

import { ReturnsService } from './returns.service';

describe('ReturnsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ReturnsService]
    });
  });

  it('should be created', inject([ReturnsService], (service: ReturnsService) => {
    expect(service).toBeTruthy();
  }));
});
