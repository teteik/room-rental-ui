import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminBookingsComponent } from './admin-bookings';

describe('AdminBookings', () => {
  let component: AdminBookingsComponent;
  let fixture: ComponentFixture<AdminBookingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminBookingsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminBookingsComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
