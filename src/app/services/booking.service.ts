import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Booking {
  id: string;
  roomId: string;
  clientId: string;
  startTime: Date;
  endTime: Date;
  price: string;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5282/api/bookings';

  createBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }
  getBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }
}
