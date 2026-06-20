import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-room-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './room-form.html',
  styleUrl: './room-form.css',
})
export class RoomFormComponent {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private router = inject(Router);

  roomForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    capacity: [0, [Validators.required, Validators.min(1)]],
    pricePerHour: [0, [Validators.required, Validators.min(0)]],
    description: ['']
  });

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomData = this.roomForm.value;
    
      if (roomData.description === '') {
        roomData.description = null;
      }
      this.roomService.createRoom(this.roomForm.value).subscribe({
        next: () => {
          this.router.navigate(['/rooms']);
        },
        error: (err) => {
          console.error('Error creating room:', err);
        }
      });
    }
  }
}