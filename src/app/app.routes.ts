import { Routes } from '@angular/router';
import { RoomsComponent } from './components/rooms/rooms';
import { RoomDetailsComponent } from './components/room-details/room-details';
import { RoomFormComponent } from './components/room-form/room-form';

export const routes: Routes = [
    { path: 'rooms', component : RoomsComponent },
    { path: 'rooms/:id', component : RoomDetailsComponent }, 
    { path: 'rooms/new', component: RoomFormComponent }
];
