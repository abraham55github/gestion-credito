import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CrearSolicitudRequest } from '../../models/crear-solicitud-request';

@Component({
  selector: 'nueva-solicitud-form',
  imports: [ReactiveFormsModule],
  templateUrl: './nueva-solicitud-form.html'
})
export class NuevaSolicitudForm {
  private readonly formBuilder = inject(FormBuilder);

  readonly guardando = input(false);
  readonly errorMensaje = input('');
  readonly exito = input(false);

  readonly crear = output<CrearSolicitudRequest>();

  readonly solicitudForm = this.formBuilder.nonNullable.group({
    cedula: ['', [Validators.required]],
    monto: [null as number | null, [Validators.required, Validators.min(500), Validators.max(50000)]],
    plazoMeses: [null as number | null, [Validators.required, Validators.min(6), Validators.max(60)]],
  });

  readonly enviado = signal(false);

  constructor() {
    effect(() => {
      if (this.exito()) {
        this.solicitudForm.reset();
        this.enviado.set(false);
      }
    });
  }

  onSubmit(): void {
    this.enviado.set(true);

    if (this.solicitudForm.invalid) {
      this.solicitudForm.markAllAsTouched();
      return;
    }

    const { cedula, monto, plazoMeses } = this.solicitudForm.getRawValue();
    // monto y plazoMeses no pueden ser null acá: Validators.required ya lo garantizó arriba.
    this.crear.emit({ cedula, monto: monto!, plazoMeses: plazoMeses! });
  }
}
