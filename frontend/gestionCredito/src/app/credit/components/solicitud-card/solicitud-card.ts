import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { SolicitudResponse } from '../../models/solicitud-response';

@Component({
  selector: 'app-solicitud-card',
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './solicitud-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SolicitudCard {
  readonly solicitud = input.required<SolicitudResponse>();

  readonly aprobar = output<SolicitudResponse>();
  readonly rechazar = output<SolicitudResponse>();
}
