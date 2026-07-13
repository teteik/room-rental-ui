import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface AuthResponse {
  token: string;
  email: string;
  fullName?: string;
  roles: string[];
  userId: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth';
  private router = inject(Router);

  currentUserSignal = signal<{
    email: string;
    fullName?: string;
    userId: string;
  } | null>(null);

  constructor() {
    const user = this.getCurrentUser();
    if (user) {
      this.currentUserSignal.set({
        email: user.email,
        fullName: user.fullName,
        userId: user.userId 
      });
    }
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register(email: string, password: string, fullName: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, { email, password, fullName });
  }

  saveUserData(response: AuthResponse): void {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      email: response.email,
      fullName: response.fullName,
      roles: response.roles,
      userId: response.userId
    }));
    this.currentUserSignal.set({
      email: response.email,
      fullName: response.fullName,
      userId: response.userId
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSignal.set(null); 
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getCurrentUser(): { email: string; fullName?: string; userId: string } | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}