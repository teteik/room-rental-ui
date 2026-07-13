import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import { Booking, BookingService } from '../../services/booking.service';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-my-bookings',
  imports: [AsyncPipe, DatePipe, NgClass, RouterLink],
  templateUrl: './my-bookings.html',
  styleUrl: './my-bookings.css',
})
export class MyBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  bookings$: Observable<Booking[]> | undefined;

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.bookings$ = this.bookingService.getMyBookings(user.userId);
  }
}