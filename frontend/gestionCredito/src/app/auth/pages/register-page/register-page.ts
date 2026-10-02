import { Component, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthCard } from '../../components/auth-card/auth-card';

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

  readonly registerForm = this.formBuilder.nonNullable.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    cedula: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
  }, { validators: contrasenasIguales });

  readonly enviado = signal(false);
  readonly exito = signal(false);

  onSubmit(): void {
    this.enviado.set(true);

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Mock: todavía no existe el backend de autenticación.
    // Cuando exista, esto pasa a ser una llamada a un AuthService real (mismo patrón que SolicitudesStore).
    const { confirmPassword, ...request } = this.registerForm.getRawValue();
    console.log('Registro (mock):', request);
    this.exito.set(true);
  }
}
