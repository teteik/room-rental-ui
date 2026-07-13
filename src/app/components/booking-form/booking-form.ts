import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { BookingService } from '../../services/booking.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-booking-form',
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingFormComponent {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);
  private router = inject(Router);
  private authService = inject(AuthService);

  roomId: string | undefined = undefined;

  room$ = this.route.queryParamMap.pipe(
    switchMap(params => {
      this.roomId = params.get('roomId')!;
      return this.roomService.getRoomById(this.roomId);
    })
  );

  bookingForm: FormGroup = this.fb.group({
    startTime: ['', Validators.required],
    endTime: ['', Validators.required]
  }, { validators: this.datesValidator });

  private datesValidator(form: FormGroup) {
    const start = form.get('startTime')?.value;
    const end = form.get('endTime')?.value;
    if (start && end && new Date(start) >= new Date(end)) {
      return { invalidDates: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;

      const currentUser = this.authService.getCurrentUser();
      if (!currentUser) {
        this.router.navigate(['/login']);
        return;
      }

      const bookingData = {
        clientId: currentUser.userId, 
        roomId: this.roomId,
        startTime: new Date(formValue.startTime).toISOString(),
        endTime: new Date(formValue.endTime).toISOString(),
      };

      this.bookingService.createBooking(bookingData).subscribe({
        next: () => {
          this.router.navigate(['/rooms', this.roomId]);
        },
        error: (err) => {
          console.error('Error creating booking:', err);
          alert('Не удалось создать бронирование');
        }
      });
    }
  }
}