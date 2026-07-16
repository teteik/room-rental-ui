import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DecimalPipe } from '@angular/common';
import { RoomService, Room } from '../../services/room.service'; 
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin-rooms',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive, DecimalPipe],
  templateUrl: './admin-rooms.html',
  styleUrl: './admin-rooms.css',
})
export class AdminRoomsComponent implements OnInit {
  private roomService = inject(RoomService);
  private authService = inject(AuthService);
  private router = inject(Router);

  rooms$: Observable<Room[]> | undefined;

  ngOnInit(): void {
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/rooms']);
      return;
    }
    this.loadRooms();
  }

  private loadRooms(): void {
    this.rooms$ = this.roomService.getRooms(); 
  }

  deleteRoom(id: string): void {
    if (!confirm('Вы уверены, что хотите удалить эту комнату?')) return;

    this.roomService.deleteRoom(id).subscribe({
      next: () => {
        this.loadRooms(); 
      },
      error: (err) => {
        console.error(err);
        alert('Не удалось удалить комнату');
      }
    });
  }
}