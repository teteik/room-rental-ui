import { Component, inject } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-rooms',
  imports: [AsyncPipe, RouterLink],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class RoomsComponent {
  private roomService = inject(RoomService);

  rooms$ = this.roomService.getRooms();
}
