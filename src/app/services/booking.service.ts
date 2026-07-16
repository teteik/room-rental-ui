import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface Booking {
  id: string;
  roomId: string;
  roomName: string;
  clientId: string;
  startTime: string;
  endTime: string;
  price: number;
  status: string;
}

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = '/api/bookings';

  createBooking(booking: Partial<Booking>): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  getMyBookings(userId: string): Observable<Booking[]> {
    const params = new HttpParams().set('clientId', userId);
    return this.http.get<Booking[]>(this.apiUrl, { params });
  }

  getAllBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>(this.apiUrl);
  }

  updateBookingStatus(id: string, action: 'confirm' | 'cancel'): Observable<Booking> {
    return this.http.post<Booking>(`${this.apiUrl}/${id}/${action}`, {});
  }
}