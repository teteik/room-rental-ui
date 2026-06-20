import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RoomService } from '../../services/room.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-room-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './room-form.html',
  styleUrl: './room-form.css',
})
export class RoomFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private roomService = inject(RoomService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isEditMode = false;
  currentId: string | null = null;

  roomForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    capacity: [0, [Validators.required, Validators.min(1)]],
    pricePerHour: [0, [Validators.required, Validators.min(0)]],
    description: ['']
  });

  ngOnInit(): void {
    this.currentId = this.route.snapshot.paramMap.get('id');
    
    if (this.currentId) {
      this.isEditMode = true;
      this.roomService.getRoomById(this.currentId).subscribe({
        next: (room) => {
          this.roomForm.patchValue({
            name: room.name,
            capacity: room.capacity,
            pricePerHour: room.pricePerHour,
            description: room.description
          });
        },
        error: (err) => console.error('Error loading room:', err)
      });
    }
  }

  onSubmit(): void {
    if (this.roomForm.valid) {
      const roomData = this.roomForm.value;
      
      if (roomData.description === '') {
        roomData.description = null;
      }

      if (this.isEditMode && this.currentId) {
        this.roomService.updateRoom(this.currentId, roomData).subscribe({
          next: () => {
            this.router.navigate(['/rooms', this.currentId]);
          },
          error: (err) => {
            console.error('Error updating room:', err);
          }
        });
      } else {
        this.roomService.createRoom(roomData).subscribe({
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
}