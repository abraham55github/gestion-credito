import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudesStore } from '../../services/solicitudes-store';
import { ErrorResponse } from '../../models/error-response';
import { CrearSolicitudRequest } from '../../models/crear-solicitud-request';
import { NuevaSolicitudForm } from '../../components/nueva-solicitud-form/nueva-solicitud-form';

@Component({
  selector: 'nuevas-solicitudes-page',
  imports: [NuevaSolicitudForm],
  templateUrl: './nuevas-solicitudes-page.html'
})
export default class NuevasSolicitudesPage {
  private readonly store = inject(SolicitudesStore);

  readonly guardando = signal(false);
  readonly errorMensaje = signal('');
  readonly exito = signal(false);

  crear(request: CrearSolicitudRequest): void {
    this.guardando.set(true);
    this.errorMensaje.set('');
    this.exito.set(false);

    this.store.crear(request).subscribe({
      next: () => {
        this.guardando.set(false);
        this.exito.set(true);
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
