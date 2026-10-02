import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthCard } from '../../components/auth-card/auth-card';
import { AuthService } from '../../services/auth.service';
import { SessionService } from '../../services/session.service';
import { extraerMensajeError } from '../../../shared/utils/extraer-mensaje-error';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, AuthCard, RouterLink],
  templateUrl: './login-page.html'
})
export class LoginPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  readonly loginForm = this.formBuilder.nonNullable.group({
    correo: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  readonly enviado = signal(false);
  readonly ingresando = signal(false);
  readonly errorMensaje = signal('');

  onSubmit(): void {
    this.enviado.set(true);
    this.errorMensaje.set('');

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.ingresando.set(true);
    this.authService.login(this.loginForm.getRawValue()).subscribe({
      next: ({ token }) => {
        this.session.guardarToken(token);
        this.router.navigateByUrl('/dashboard/solicitudes');
      },
      error: (error: HttpErrorResponse) => {
        this.ingresando.set(false);
        this.errorMensaje.set(extraerMensajeError(error, 'No se pudo iniciar sesión. Intenta nuevamente.'));
      },
    });
  }
}
