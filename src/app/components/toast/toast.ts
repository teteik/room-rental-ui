import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ToastrService, Toast } from '../../services/toast.service'; 

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastComponent {
  private toastrService = inject(ToastrService);

  toasts$ = this.toastrService.getToasts();

  closeToast(id: string): void {
    this.toastrService.removeToast(id);
  }
}