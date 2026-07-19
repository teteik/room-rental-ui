import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RoomImage {
  id: string;
  imageUrl: string;
}

export interface Room {
  id: string;
  name: string;
  capacity: number;
  pricePerHour: number;
  description: string;
  images: RoomImage[];
}

export interface BookedSlot {
  startTime: string;
  endTime: string;
}

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  private http = inject(HttpClient);

  private apiUrl = '/api/rooms';

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

  updateRoom(id: string, room: Partial<Room>): Observable<Room> {
    return this.http.put<Room>(`${this.apiUrl}/${id}`, room);
  }

  getRoomSchedule(roomId: string, date: string) : Observable<BookedSlot[]> {
    return this.http.get<BookedSlot[]>(`${this.apiUrl}/${roomId}/schedule?date=${date}`);
  }

  uploadRoomImage(roomId: string, file: File): Observable<Room> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<Room>(`${ this.apiUrl}/${roomId}/images`, formData);
  }

  deleteRoomImage(roomId: string, imageId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${roomId}/images/${imageId}`);
  }
}
