import { Component, inject, OnInit } from '@angular/core';
import { SolicitudResponse } from '../../models/solicitud-response';
import { EstadoSolicitud } from '../../models/estado-solicitud';
import { SolicitudCard } from '../../components/solicitud-card/solicitud-card';
import { FiltroEstado, SolicitudesStore } from '../../services/solicitudes-store';

@Component({
  selector: 'solicitudes-page',
  imports: [SolicitudCard],
  templateUrl: './solicitudes-page.html'
})
export default class SolicitudesPage implements OnInit {
  private readonly store = inject(SolicitudesStore);

  readonly filtros: FiltroEstado[] = ['TODAS', 'PENDIENTE', 'APROBADA', 'RECHAZADA'];

  readonly solicitudes = this.store.solicitudes;
  readonly filtro = this.store.filtro;
  readonly cargando = this.store.cargando;
  readonly errorMensaje = this.store.errorMensaje;

  ngOnInit(): void {
    this.store.cargarInicial();
  }

  cambiarFiltro(filtro: FiltroEstado): void {
    this.store.cambiarFiltro(filtro);
  }

  aprobar(solicitud: SolicitudResponse): void {
    this.pedirComentarioYCambiarEstado(solicitud, 'APROBADA');
  }

  rechazar(solicitud: SolicitudResponse): void {
    this.pedirComentarioYCambiarEstado(solicitud, 'RECHAZADA');
  }

  private pedirComentarioYCambiarEstado(solicitud: SolicitudResponse, estado: EstadoSolicitud): void {
    const accion = estado === 'APROBADA' ? 'aprobar' : 'rechazar';
    const comentario = window.prompt(`Comentario para ${accion} la solicitud de ${solicitud.cedula}:`);

    if (!comentario || !comentario.trim()) {
      return;
    }

    this.store.cambiarEstado(solicitud, estado, comentario);
  }
}
