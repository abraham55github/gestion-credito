import { Component, computed, input, output, signal } from '@angular/core';
import { EstadoSolicitud } from '../../models/estado-solicitud';

@Component({
  selector: 'confirmar-estado-modal',
  imports: [],
  templateUrl: './confirmar-estado-modal.html'
})
export class ConfirmarEstadoModal {
  readonly estado = input.required<EstadoSolicitud>();
  readonly cedula = input.required<string>();

  readonly confirmar = output<string>();
  readonly cancelar = output<void>();

  readonly comentario = signal('');

  readonly esAprobacion = computed(() => this.estado() === 'APROBADA');
  readonly titulo = computed(() => (this.esAprobacion() ? 'Aprobar solicitud' : 'Rechazar solicitud'));

  actualizarComentario(valor: string): void {
    this.comentario.set(valor);
  }

  onConfirmar(): void {
    if (!this.comentario().trim()) {
      return;
    }
    this.confirmar.emit(this.comentario().trim());
  }
}
