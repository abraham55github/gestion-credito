import { Component, input, output } from '@angular/core';
import { SolicitudResponse } from '../../models/solicitud-response';
import { SolicitudCardHeader } from './solicitud-card-header/solicitud-card-header';
import { SolicitudCardInfo } from './solicitud-card-info/solicitud-card-info';
import { SolicitudCardState } from './solicitud-card-state/solicitud-card-state';

@Component({
  selector: 'solicitud-card',
  imports: [SolicitudCardHeader, SolicitudCardInfo, SolicitudCardState],
  templateUrl: './solicitud-card.html'
})
export class SolicitudCard {
  readonly solicitud = input.required<SolicitudResponse>();

  readonly aprobar = output<SolicitudResponse>();
  readonly rechazar = output<SolicitudResponse>();
}
