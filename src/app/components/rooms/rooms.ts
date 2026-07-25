import { Component, inject } from '@angular/core';
import { RoomService } from '../../services/room.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-rooms',
  imports: [AsyncPipe, RouterLink, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class RoomsComponent {
  private roomService = inject(RoomService);

  searchQuery: string = '';
  minCapacity?: number; 
  maxPrice?: number;

  rooms$ = this.roomService.getRooms(); 

  ngOnInit(): void {
    this.applyFilters(); 
  }

  applyFilters(): void {
    this.rooms$ = this.roomService.getRooms(
      this.searchQuery,
      this.minCapacity,
      this.maxPrice
    );
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.minCapacity = undefined; 
    this.maxPrice = undefined;    
    this.applyFilters();
  }
}
