import { Component, inject, OnInit } from '@angular/core';
import { SolicitudCard } from '../../components/solicitud-card/solicitud-card';
import { CambioEstadoEvento } from '../../components/solicitud-card/solicitud-card-state/solicitud-card-state';
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

  cambiarEstado(evento: CambioEstadoEvento): void {
    this.store.cambiarEstado(evento.solicitud, evento.estado, evento.comentario);
  }
}
