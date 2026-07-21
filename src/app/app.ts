import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { ToastComponent } from "./components/toast/toast";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ToastComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = 'room-rental-ui';
  private authService = inject(AuthService);
  
  currentUserSignal = this.authService.currentUserSignal;

  logout(): void {
    this.authService.logout();
  }
}