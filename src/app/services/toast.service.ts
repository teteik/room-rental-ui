import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error';
  isLeaving?: boolean; 
}

@Injectable({
  providedIn: 'root',
})
export class ToastrService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);

  getToasts(): Observable<Toast[]> {
    return this.toastsSubject.asObservable();
  }

  showSuccess(message: string): void {
    this.addToast(message, 'success');
  }

  showError(message: string): void {
    this.addToast(message, 'error');
  }

  removeToast(id: string): void {
    const currentToasts = this.toastsSubject.value;
    const toast = currentToasts.find(t => t.id === id);
    
    if (toast && !toast.isLeaving) {
      this.toastsSubject.next(
        currentToasts.map(t => t.id === id ? { ...t, isLeaving: true } : t)
      );
      
      setTimeout(() => {
        const updatedToasts = this.toastsSubject.value.filter(t => t.id !== id);
        this.toastsSubject.next(updatedToasts);
      }, 300);
    }
  }

  private addToast(message: string, type: 'success' | 'error'): void {
    const id =  crypto.randomUUID();
    const toast: Toast = { id, message, type };
    

    this.toastsSubject.next([...this.toastsSubject.value, toast]);

    setTimeout(() => {
      this.removeToast(id);
    }, 4000);
  }
}
