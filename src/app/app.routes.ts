import { Routes } from '@angular/router';
import { RoomsComponent } from './components/rooms/rooms';
import { RoomDetailsComponent } from './components/room-details/room-details';

export const routes: Routes = [
    { path: 'rooms', component : RoomsComponent },
    { path: 'rooms/:id', component : RoomDetailsComponent }
];
