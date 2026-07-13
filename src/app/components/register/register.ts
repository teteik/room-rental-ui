import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm = this.fb.group({
    fullName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    const { fullName, email, password } = this.registerForm.value;

    this.authService.register(email!, password!, fullName!).subscribe({
      next:(response) => {
        this.authService.saveUserData(response);
        this.router.navigate(['/rooms']);
      },
      error:(err) => {
        console.error('Ошибка регистрации: ', err);
        alert('Не удалось зарегистрироваться');
      }
    })
  }
}

