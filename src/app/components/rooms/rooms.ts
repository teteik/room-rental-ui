import { Component, inject, OnInit } from '@angular/core';
import { Room, RoomService, PagedResult } from '../../services/room.service';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-rooms',
  imports: [AsyncPipe, RouterLink, FormsModule],
  templateUrl: './rooms.html',
  styleUrl: './rooms.css',
})
export class RoomsComponent implements OnInit {
  private roomService = inject(RoomService);
  public authService = inject(AuthService);

  searchQuery: string = '';
  minCapacity?: number;
  maxPrice?: number;

  currentPage: number = 1;
  pageSize: number = 9;
  totalItems: number = 0;

  rooms$: Observable<Room[]> = of([]);

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.currentPage = 1;
    this.loadRooms();
  }

  private loadRooms(): void {
    this.rooms$ = this.roomService.getRooms(
      this.searchQuery,
      this.minCapacity,
      this.maxPrice,
      this.currentPage,
      this.pageSize
    ).pipe(
      map(response => {
        this.totalItems = response.totalCount;
        return response.items;
      })
    );
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadRooms();
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.minCapacity = undefined;
    this.maxPrice = undefined;
    this.applyFilters();
  }

  onPageSizeChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.pageSize = parseInt(selectElement.value, 10);
    this.currentPage = 1;
    this.loadRooms();
  }

  Math = Math;
}