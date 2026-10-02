import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { CambiarEstadoRequest } from '../models/cambiar-estado-request';
import { CrearSolicitudRequest } from '../models/crear-solicitud-request';
import { EstadoSolicitud } from '../models/estado-solicitud';
import { SolicitudResponse } from '../models/solicitud-response';

@Injectable({ providedIn: 'root' })
export class SolicitudCreditoService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/solicitudes`;

  crear(request: CrearSolicitudRequest): Observable<SolicitudResponse> {
    return this.http.post<SolicitudResponse>(this.baseUrl, request);
  }

  listar(estado?: EstadoSolicitud): Observable<SolicitudResponse[]> {
    const params = estado ? new HttpParams().set('estado', estado) : undefined;
    return this.http.get<SolicitudResponse[]>(this.baseUrl, { params });
  }

  cambiarEstado(id: number, request: CambiarEstadoRequest): Observable<SolicitudResponse> {
    return this.http.patch<SolicitudResponse>(`${this.baseUrl}/${id}/estado`, request);
  }
}
