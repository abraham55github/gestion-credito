import { Component, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { SolicitudCreditoService } from '../../services/solicitud-credito.service';
import { SolicitudResponse } from '../../models/solicitud-response';
import { EstadoSolicitud } from '../../models/estado-solicitud';
import { ErrorResponse } from '../../models/error-response';
import { SolicitudCard } from '../../components/solicitud-card/solicitud-card';

type FiltroEstado = EstadoSolicitud | 'TODAS';

@Component({
  selector: 'app-solicitudes-page',
  imports: [SolicitudCard],
  templateUrl: './solicitudes-page.html'
})
export default class SolicitudesPage {
  private readonly solicitudCreditoService = inject(SolicitudCreditoService);

  readonly filtros: FiltroEstado[] = ['TODAS', 'PENDIENTE', 'APROBADA', 'RECHAZADA'];

  readonly solicitudes = signal<SolicitudResponse[]>([]);
  readonly filtro = signal<FiltroEstado>('TODAS');
  readonly cargando = signal(false);
  readonly errorMensaje = signal('');

  constructor() {
    this.cargar();
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.filtro.set(filtro);
    this.cargar();
  }

  aprobar(solicitud: SolicitudResponse): void {
    this.pedirComentarioYCambiarEstado(solicitud, 'APROBADA');
  }

  rechazar(solicitud: SolicitudResponse): void {
    this.pedirComentarioYCambiarEstado(solicitud, 'RECHAZADA');
  }

  private cargar(): void {
    this.cargando.set(true);
    this.errorMensaje.set('');
    const estado = this.filtro() === 'TODAS' ? undefined : (this.filtro() as EstadoSolicitud);

    this.solicitudCreditoService.listar(estado).subscribe({
      next: (solicitudes) => {
        this.solicitudes.set(solicitudes);
        this.cargando.set(false);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMensaje.set(this.extraerMensaje(error, 'No se pudieron cargar las solicitudes.'));
        this.cargando.set(false);
      },
    });
  }

  private pedirComentarioYCambiarEstado(solicitud: SolicitudResponse, estado: EstadoSolicitud): void {
    const accion = estado === 'APROBADA' ? 'aprobar' : 'rechazar';
    const comentario = window.prompt(`Comentario para ${accion} la solicitud de ${solicitud.cedula}:`);

    if (!comentario || !comentario.trim()) {
      return;
    }

    this.solicitudCreditoService.cambiarEstado(solicitud.id, { estado, comentario }).subscribe({
      next: () => this.cargar(),
      error: (error: HttpErrorResponse) => {
        this.errorMensaje.set(this.extraerMensaje(error, 'No se pudo actualizar la solicitud.'));
      },
    });
  }

  private extraerMensaje(error: HttpErrorResponse, mensajePorDefecto: string): string {
    const backendError = error.error as ErrorResponse | undefined;
    const detalle = backendError?.errores?.length ? ` (${backendError.errores.join(', ')})` : '';
    return (backendError?.mensaje ?? mensajePorDefecto) + detalle;
  }
}
