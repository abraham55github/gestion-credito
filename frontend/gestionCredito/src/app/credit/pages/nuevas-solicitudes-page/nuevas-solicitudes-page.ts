import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { SolicitudCreditoService } from '../../services/solicitud-credito.service';

@Component({
  selector: 'nuevas-solicitudes-page',
  imports: [ReactiveFormsModule],
  templateUrl: './nuevas-solicitudes-page.html'
})
export default class NuevasSolicitudesPage {
  private readonly formBuilder = inject(FormBuilder);
  private readonly solicitudCreditoService = inject(SolicitudCreditoService);

  readonly solicitudForm = this.formBuilder.nonNullable.group({
    cedula: ['', [Validators.required]],
    monto: [null as number | null, [Validators.required]],
    plazoMeses: [null as number | null, [Validators.required]],
  });

  guardando = false;
  errorMensaje = '';
  exito = false;

  onSubmit(): void {
    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }

    const { cedula, monto, plazoMeses } = this.solicitudForm.getRawValue();

    this.guardando = true;
    this.errorMensaje = '';
    this.exito = false;

    this.solicitudCreditoService.crear({ cedula, monto: monto!, plazoMeses: plazoMeses! }).subscribe({
      next: () => {
        this.guardando = false;
        this.exito = true;
        this.solicitudForm.reset();
      },
      error: () => {
        this.guardando = false;
        this.errorMensaje = 'No se pudo crear la solicitud. Intenta nuevamente.';
      },
    });
  }
}