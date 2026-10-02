import { Component, computed, input, output, signal } from '@angular/core';
import { EstadoSolicitud } from '../../../models/estado-solicitud';
import { SolicitudResponse } from '../../../models/solicitud-response';
import { ConfirmarEstadoModal } from '../../confirmar-estado-modal/confirmar-estado-modal';

export interface CambioEstadoEvento {
  solicitud: SolicitudResponse;
  estado: EstadoSolicitud;
  comentario: string;
}

@Component({
  selector: 'solicitud-card-state',
  imports: [ConfirmarEstadoModal],
  templateUrl: './solicitud-card-state.html'
})
export class SolicitudCardState {
  readonly solicitud = input.required<SolicitudResponse>();

  readonly cambiarEstado = output<CambioEstadoEvento>();

  readonly esPendiente = computed(() => this.solicitud().estado === 'PENDIENTE');
  readonly estadoPorConfirmar = signal<EstadoSolicitud | null>(null);

  abrirAprobar(): void {
    this.estadoPorConfirmar.set('APROBADA');
  }

  abrirRechazar(): void {
    this.estadoPorConfirmar.set('RECHAZADA');
  }

  cerrarModal(): void {
    this.estadoPorConfirmar.set(null);
  }

  confirmar(comentario: string): void {
    const estado = this.estadoPorConfirmar();
    if (!estado) {
      return;
    }

    this.cambiarEstado.emit({ solicitud: this.solicitud(), estado, comentario });
    this.estadoPorConfirmar.set(null);
  }
}
