import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { switchMap } from 'rxjs';

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

  room$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id')!;
      return this.roomService.getRoomById(id);
    })
  )

  deleteRoom(): void {
    if (confirm('Вы уверены?')) {
      const id = this.route.snapshot.paramMap.get('id')!;
      this.roomService.deleteRoom(id).subscribe({
        next: () => this.router.navigate(['/rooms']),
        error: (err) => {
            console.error('Error deleting room:', err);
            alert('Не удалось удалить комнату');
        }
      });
    }
  }
}
