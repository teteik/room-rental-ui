import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-booking-form',
  imports: [AsyncPipe, ReactiveFormsModule, RouterLink],
  templateUrl: './booking-form.html',
  styleUrl: './booking-form.css',
})
export class BookingFormComponent {
  private roomService = inject(RoomService);
  private route = inject(ActivatedRoute);

  room$ = this.route.queryParamMap.pipe(
    switchMap(params => {
      const id = params.get('roomId')!;
      return this.roomService.getRoomById(id);
    })
  )
}
