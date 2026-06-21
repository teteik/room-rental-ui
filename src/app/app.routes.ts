import { Routes } from '@angular/router';
import { RoomsComponent } from './components/rooms/rooms';
import { RoomDetailsComponent } from './components/room-details/room-details';
import { RoomFormComponent } from './components/room-form/room-form';
import { BookingFormComponent } from './components/booking-form/booking-form';

export const routes: Routes = [
    { path: 'rooms', component : RoomsComponent },
    { path: 'rooms/new', component: RoomFormComponent },
    { path: 'rooms/edit/:id', component: RoomFormComponent },
    { path: 'rooms/:id', component: RoomDetailsComponent },
    { path: 'bookings/new', component:BookingFormComponent }
    
];
