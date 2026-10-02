import { Component, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { SolicitudResponse } from '../../../models/solicitud-response';

@Component({
  selector: 'solicitud-card-info',
  imports: [CurrencyPipe],
  templateUrl: './solicitud-card-info.html'
})
export class SolicitudCardInfo {
  readonly solicitud = input.required<SolicitudResponse>();
}
