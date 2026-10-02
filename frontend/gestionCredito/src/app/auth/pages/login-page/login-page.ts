import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthCard } from '../../components/auth-card/auth-card';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, AuthCard, RouterLink],
  templateUrl: './login-page.html'
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);

  readonly loginForm = this.formBuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly enviado = signal(false);

  onSubmit(): void {
    this.enviado.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    // Mock: todavía no existe el backend de autenticación.
    console.log('Login (mock):', this.loginForm.getRawValue());
  }
}
