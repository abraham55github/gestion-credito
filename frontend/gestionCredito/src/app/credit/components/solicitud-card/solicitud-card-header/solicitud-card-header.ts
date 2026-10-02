import { Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { SolicitudResponse } from '../../../models/solicitud-response';

@Component({
  selector: 'solicitud-card-header',
  imports: [DatePipe],
  templateUrl: './solicitud-card-header.html'
})
export class SolicitudCardHeader {
  readonly solicitud = input.required<SolicitudResponse>();
}
