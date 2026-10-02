import { HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CrearSolicitudRequest } from '../models/crear-solicitud-request';
import { EstadoSolicitud } from '../models/estado-solicitud';
import { SolicitudResponse } from '../models/solicitud-response';
import { extraerMensajeError } from '../../shared/utils/extraer-mensaje-error';
import { SolicitudCreditoService } from './solicitud-credito.service';

export type FiltroEstado = EstadoSolicitud | 'TODAS';

@Injectable({ providedIn: 'root' })
export class SolicitudesStore {
  private readonly solicitudCreditoService = inject(SolicitudCreditoService);

  // Una lista cacheada por filtro: cambiar de pestaña no vuelve a pedirle nada al backend
  // si ese filtro ya se cargó antes en esta sesión.
  private readonly cache = new Map<FiltroEstado, SolicitudResponse[]>();

  readonly solicitudes = signal<SolicitudResponse[]>([]);
  readonly filtro = signal<FiltroEstado>('TODAS');
  readonly cargando = signal(false);
  readonly errorMensaje = signal('');

  cargarInicial(): void {
    const enCache = this.cache.get(this.filtro());
    if (enCache) {
      this.solicitudes.set(enCache);
      return;
    }
    this.cargarDesdeBackend();
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtro.set(filtro);
    this.errorMensaje.set('');

    const enCache = this.cache.get(filtro);
    if (enCache) {
      this.solicitudes.set(enCache);
      return;
    }
    this.cargarDesdeBackend();
  }

  crear(request: CrearSolicitudRequest): Observable<SolicitudResponse> {
    return this.solicitudCreditoService.crear(request).pipe(
      tap((creada) => this.agregarEnCache(creada)),
    );
  }

  cambiarEstado(solicitud: SolicitudResponse, estado: EstadoSolicitud, comentario: string): void {
    this.errorMensaje.set('');

    this.solicitudCreditoService.cambiarEstado(solicitud.id, { estado, comentario }).subscribe({
      next: (actualizada) => this.actualizarEnCache(actualizada),
      error: (error: HttpErrorResponse) => {
        this.errorMensaje.set(extraerMensajeError(error, 'No se pudo actualizar la solicitud.'));
      },
    });
  }

  private cargarDesdeBackend(): void {
    this.cargando.set(true);
    this.errorMensaje.set('');
    const filtro = this.filtro();
    const estado = filtro === 'TODAS' ? undefined : filtro;

    this.solicitudCreditoService.listar(estado).subscribe({
      next: (solicitudes) => {
        this.cache.set(filtro, solicitudes);
        this.solicitudes.set(solicitudes);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje.set(extraerMensajeError(error, 'No se pudieron cargar las solicitudes.'));
        this.cargando.set(false);
      },
    });
  }

  private agregarEnCache(creada: SolicitudResponse): void {
    for (const [filtro, lista] of this.cache.entries()) {
      if (filtro === 'TODAS' || filtro === creada.estado) {
        this.cache.set(filtro, [creada, ...lista]);
      }
    }

    if (this.filtro() === 'TODAS' || this.filtro() === creada.estado) {
      this.solicitudes.update((lista) => [creada, ...lista]);
    }
  }

  private actualizarEnCache(actualizada: SolicitudResponse): void {
    for (const [filtro, lista] of this.cache.entries()) {
      const perteneceAEsteFiltro = filtro === 'TODAS' || filtro === actualizada.estado;

      if (!perteneceAEsteFiltro) {
        this.cache.set(filtro, lista.filter((s) => s.id !== actualizada.id));
        continue;
      }

      const yaEstaba = lista.some((s) => s.id === actualizada.id);
      this.cache.set(filtro, yaEstaba
        ? lista.map((s) => (s.id === actualizada.id ? actualizada : s))
        : [...lista, actualizada]);
    }

    this.solicitudes.set(this.cache.get(this.filtro()) ?? []);
  }
}
