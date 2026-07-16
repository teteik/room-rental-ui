import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, DatePipe, NgClass, SlicePipe } from '@angular/common';
import { Booking, BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-bookings',
  imports: [AsyncPipe, DatePipe, SlicePipe, RouterLink, RouterLinkActive],
  templateUrl: './admin-bookings.html',
  styleUrl: './admin-bookings.css',
})
export class AdminBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  bookings$: Observable<Booking[]> | undefined;

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/rooms']);
      return;
    }

    this.bookings$ = this.bookingService.getAllBookings();
  }

  onAction(booking: Booking, action: 'confirm' | 'cancel'): void {
    if (!confirm(`Вы уверены, что хотите ${action === 'confirm' ? 'подтвердить' : 'отменить'} бронь?`)) return;

    this.bookingService.updateBookingStatus(booking.id, action).subscribe({
      next: () => {
        this.bookings$ = this.bookingService.getAllBookings();
      },
      error: (err) => {
        console.error(err);
        alert(err.error || 'Не удалось изменить статус');
      }
    });
  }
}