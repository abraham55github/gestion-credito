import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { AuthCard } from '../../components/auth-card/auth-card';
import { AuthService } from '../../services/auth.service';
import { extraerMensajeError } from '../../../shared/utils/extraer-mensaje-error';

function contrasenasIguales(control: AbstractControl): ValidationErrors | null {
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { contrasenasDistintas: true };
}

@Component({
  selector: 'register-page',
  imports: [ReactiveFormsModule, AuthCard, RouterLink],
  templateUrl: './register-page.html'
})
export class RegisterPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly registerForm = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    cedula: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: contrasenasIguales });

  readonly enviado = signal(false);
  readonly guardando = signal(false);
  readonly errorMensaje = signal('');

  onSubmit(): void {
    this.enviado.set(true);
    this.errorMensaje.set('');

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const { confirmPassword, ...request } = this.registerForm.getRawValue();

    this.authService.registrar(request).subscribe({
      next: () => this.router.navigateByUrl('/login'),
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        this.errorMensaje.set(extraerMensajeError(error, 'No se pudo crear la cuenta. Intenta nuevamente.'));
      },
    });
  }
}
