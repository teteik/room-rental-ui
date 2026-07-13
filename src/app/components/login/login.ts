import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule], 
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class LoginComponent { 
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email!, password!).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this.router.navigate(['/rooms']);
      },
      error: (err) => {
        console.error('Ошибка входа:', err);
        alert('Неверный логин или пароль');
      }
    });
  }
}