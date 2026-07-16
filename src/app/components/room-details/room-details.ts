import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService, BookedSlot } from '../../services/room.service';
import { BookingService } from '../../services/booking.service';
import { Observable, combineLatest, map, switchMap, forkJoin, BehaviorSubject } from 'rxjs';
import { AuthService } from '../../services/auth.service';

export interface TimeSlot {
  date: string;
  hour: number;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

export interface DaySchedule {
  date: string;
  dayOfWeek: string;
  dayOfMonth: number;
  slots: TimeSlot[];
}

@Component({
  selector: 'app-room-details',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './room-details.html',
  styleUrl: './room-details.css',
})
export class RoomDetailsComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private roomService = inject(RoomService);
  private bookingService = inject(BookingService);
  public authService = inject(AuthService);

  weekStart$ = new BehaviorSubject<Date>(this.getMonday(new Date()));
  
  selectedStartSlot: TimeSlot | null = null;
  selectedEndSlot: TimeSlot | null = null;

  room$: Observable<any> = this.route.paramMap.pipe(
    map(params => params.get('id')!),
    switchMap(id => this.roomService.getRoomById(id))
  );

  weekDates$: Observable<string[]> = this.weekStart$.pipe(
    map(start => this.getWeekDates(start))
  );

  bookedSlotsByDate$: Observable<Map<string, BookedSlot[]>> = combineLatest([
    this.route.paramMap.pipe(map(params => params.get('id')!)),
    this.weekDates$
  ]).pipe(
    switchMap(([roomId, dates]) => {
      const requests = dates.map(date =>
        this.roomService.getRoomSchedule(roomId, date).pipe(
          map(slots => ({ date, slots }))
        )
      );
      return forkJoin(requests).pipe(
        map(results => {
          const map = new Map<string, BookedSlot[]>();
          results.forEach(({ date, slots }) => map.set(date, slots));
          return map;
        })
      );
    })
  );

  weekSchedule$: Observable<DaySchedule[]> = combineLatest([
    this.weekDates$,
    this.bookedSlotsByDate$
  ]).pipe(
    map(([dates, bookedMap]) =>
      dates.map(date => ({
        date,
        dayOfWeek: this.getDayOfWeekName(date),
        dayOfMonth: new Date(date).getDate(),
        slots: this.generateTimeSlots(date, bookedMap.get(date) || [])
      }))
    )
  );

  private getMonday(d: Date): Date {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    date.setHours(0, 0, 0, 0);
    return date;
  }

  private getWeekDates(start: Date): string[] {
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      dates.push(d.toLocaleDateString('en-CA'));
    }
    return dates;
  }

  private getDayOfWeekName(dateStr: string): string {
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[new Date(dateStr).getDay()];
  }

  private generateTimeSlots(date: string, bookedSlots: BookedSlot[]): TimeSlot[] {
    const slots: TimeSlot[] = [];
    const [year, month, day] = date.split('-').map(Number);

    for (let hour = 9; hour <= 21; hour++) {
      const startTime = new Date(year, month - 1, day, hour, 0, 0);
      const endTime = new Date(year, month - 1, day, hour + 1, 0, 0);

      const isBooked = bookedSlots.some(slot => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);
        return startTime.getTime() < slotEnd.getTime() && endTime.getTime() > slotStart.getTime();
      });

      slots.push({
        date,
        hour,
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        isBooked
      });
    }

    return slots;
  }

  goToPrevWeek(): void {
    const current = this.weekStart$.value;
    const prev = new Date(current);
    prev.setDate(current.getDate() - 7);
    this.weekStart$.next(prev);
    this.resetSelection();
  }

  goToNextWeek(): void {
    const current = this.weekStart$.value;
    const next = new Date(current);
    next.setDate(current.getDate() + 7);
    this.weekStart$.next(next);
    this.resetSelection();
  }

  selectSlot(slot: TimeSlot): void {
    if (slot.isBooked) return;

    if (!this.selectedStartSlot) {
      this.selectedStartSlot = slot;
    } else if (!this.selectedEndSlot) {
      const start = new Date(this.selectedStartSlot.startTime).getTime();
      const end = new Date(slot.startTime).getTime();
      
      if (end > start) {
        this.selectedEndSlot = slot;
      } else {
        this.selectedEndSlot = this.selectedStartSlot;
        this.selectedStartSlot = slot;
      }
    } else {
      this.selectedStartSlot = slot;
      this.selectedEndSlot = null;
    }
  }

  isSlotInRange(slot: TimeSlot): boolean {
    if (!this.selectedStartSlot || !this.selectedEndSlot) return false;
    
    const slotTime = new Date(slot.startTime).getTime();
    const startTime = new Date(this.selectedStartSlot.startTime).getTime();
    const endTime = new Date(this.selectedEndSlot.startTime).getTime();
    
    return slotTime >= startTime && slotTime <= endTime;
  }

  resetSelection(): void {
    this.selectedStartSlot = null;
    this.selectedEndSlot = null;
  }

  bookSelectedRange(roomId: string): void {
    if (!this.selectedStartSlot || !this.selectedEndSlot) return;

    if (this.selectedStartSlot.startTime === this.selectedEndSlot.endTime) {
      alert('Выберите разные слоты для начала и конца бронирования');
      return;
    }

    const clientId = 'ee535a6f-e199-4fec-8efa-662bd3f6f42a';

    const bookingData = {
      clientId,
      roomId,
      startTime: this.selectedStartSlot.startTime,
      endTime: this.selectedEndSlot.endTime,
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        const hours = Math.round((new Date(this.selectedEndSlot!.endTime).getTime() - new Date(this.selectedStartSlot!.startTime).getTime()) / 3600000);
        alert(`Бронирование успешно создано на ${hours} ч.!`);
        this.resetSelection();
        this.weekStart$.next(new Date(this.weekStart$.value));
      },
      error: (err) => {
        console.error('Error creating booking:', err);
        alert('Не удалось создать бронирование');
      }
    });
  }

  deleteRoom(): void {
    if (confirm('Вы уверены?')) {
      this.route.paramMap.pipe(
        map(params => params.get('id')!),
        switchMap(id => this.roomService.deleteRoom(id))
      ).subscribe({
        next: () => this.router.navigate(['/rooms']),
        error: (err) => {
          console.error('Error deleting room:', err);
          alert('Не удалось удалить комнату');
        }
      });
    }
  }

  confirmBooking(roomId: string): void {
    if (!this.selectedStartSlot || !this.selectedEndSlot) return;

    const user = this.authService.getCurrentUser();
    if (!user) {
      sessionStorage.setItem('redirectAfterLogin', window.location.href);
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedStartSlot.startTime === this.selectedEndSlot.endTime) {
      alert('Выберите разные слоты для начала и конца бронирования');
      return;
    }

    const bookingData = {
      clientId: user.userId, 
      roomId,
      startTime: this.selectedStartSlot.startTime,
      endTime: this.selectedEndSlot.endTime,
    };

    this.bookingService.createBooking(bookingData).subscribe({
      next: () => {
        const hours = Math.round(
          (new Date(this.selectedEndSlot!.endTime).getTime() - 
           new Date(this.selectedStartSlot!.startTime).getTime()) / 3600000
        );
        alert(`Бронирование успешно создано на ${hours} ч.!`);
        this.resetSelection();
        this.weekStart$.next(new Date(this.weekStart$.value));
      },
      error: (err) => {
        console.error('Error creating booking:', err);
        alert(err.error || 'Не удалось создать бронирование');
      }
    });
  }
}