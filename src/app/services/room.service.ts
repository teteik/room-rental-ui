import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:5282/api/rooms';

  getRooms(): Observable<Room[]> {
    return this.http.get<Room[]>(this.apiUrl);
  }

  getRoomById(id: string): Observable<Room> {
    return this.http.get<Room>(`${this.apiUrl}/${id}`)
  }

  createRoom(room: Partial<Room>): Observable<Room> {
    return this.http.post<Room>(this.apiUrl, room);
  }

  deleteRoom(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
/*
  updateRoom(id: string, room: Partial<Room>): Observable<Room> {
    return this.http.put(this.apiUrl, room, )
  }
*/
}
