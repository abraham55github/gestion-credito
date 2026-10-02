import { Component, computed, input, output } from '@angular/core';
import { SolicitudResponse } from '../../../models/solicitud-response';

@Component({
  selector: 'solicitud-card-state',
  imports: [],
  templateUrl: './solicitud-card-state.html'
})
export class SolicitudCardState {
  readonly solicitud = input.required<SolicitudResponse>();

  readonly aprobar = output<SolicitudResponse>();
  readonly rechazar = output<SolicitudResponse>();

  readonly esPendiente = computed(() => this.solicitud().estado === 'PENDIENTE');
}
