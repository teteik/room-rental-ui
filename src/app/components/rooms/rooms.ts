import { Component, OnInit, inject } from '@angular/core';
import { RoomService, Room } from '../../services/room.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-rooms',
  imports: [AsyncPipe],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class RoomsComponent {
  private roomService = inject(RoomService);

  rooms$ = this.roomService.getRooms();
}
