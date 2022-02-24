import { TestBed } from '@angular/core/testing';

import { ORMService } from './orm.service';

describe('ORMService', () => {
  let service: ORMService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ORMService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
