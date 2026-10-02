import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudesStore } from '../../services/solicitudes-store';
import { ErrorResponse } from '../../models/error-response';

@Component({
  selector: 'nuevas-solicitudes-page',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevas-solicitudes-page.html'
})
export default class NuevasSolicitudesPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly store = inject(SolicitudesStore);

  readonly solicitudForm = this.formBuilder.nonNullable.group({
    cedula: ['', [Validators.required]],
    monto: [null as number | null, [Validators.required, Validators.min(500), Validators.max(50000)]],
    plazoMeses: [null as number | null, [Validators.required, Validators.min(6), Validators.max(60)]],
  });

  readonly enviado = signal(false);
  readonly guardando = signal(false);
  readonly errorMensaje = signal('');
  readonly exito = signal(false);

  onSubmit(): void {
    this.enviado.set(true);
    this.errorMensaje.set('');
    this.exito.set(false);

    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const { cedula, monto, plazoMeses } = this.solicitudForm.getRawValue();
    // monto y plazoMeses no pueden ser null acá: Validators.required ya lo garantizó arriba.
    this.store.crear({ cedula, monto: monto!, plazoMeses: plazoMeses! }).subscribe({
      next: () => {
        this.guardando.set(false);
        this.exito.set(true);
        this.enviado.set(false);
        this.solicitudForm.reset();
      },
      error: (error: HttpErrorResponse) => {
        this.guardando.set(false);
        const backendError = error.error as ErrorResponse | undefined;
        const detalle = backendError?.errores?.length ? ` (${backendError.errores.join(', ')})` : '';
        this.errorMensaje.set((backendError?.mensaje ?? 'No se pudo crear la solicitud. Intenta nuevamente.') + detalle);
      },
    });
  }
}
