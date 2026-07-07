import { Component, inject } from '@angular/core';
import { AsyncPipe, DatePipe, SlicePipe, NgClass } from '@angular/common';
import { BookingService } from '../../services/booking.service';


@Component({
  selector: 'app-my-bookings',
  imports: [AsyncPipe, DatePipe, SlicePipe, NgClass],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})

export class MyBookingsComponent {
  private bookingService = inject(BookingService);
  
  bookings$ = this.bookingService.getBookings();
}