import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { CrearSolicitudRequest } from '../models/crear-solicitud-request';
import { SolicitudResponse } from '../models/solicitud-response';

@Injectable({ providedIn: 'root' })
export class SolicitudCreditoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/solicitudes`;

  crear(request: CrearSolicitudRequest): Observable<SolicitudResponse> {
    return this.http.post<SolicitudResponse>(this.baseUrl, request);
  }

}
