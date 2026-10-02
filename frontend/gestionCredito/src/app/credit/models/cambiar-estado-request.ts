import { EstadoSolicitud } from './estado-solicitud';

export interface CambiarEstadoRequest {
    estado: EstadoSolicitud;
    comentario: string;
}
