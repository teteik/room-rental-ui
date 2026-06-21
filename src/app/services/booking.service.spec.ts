import { TestBed } from '@angular/core/testing';

import { BookingService } from './booking.service';

describe('BookingSerrvice', () => {
  let service: BookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
