import { EstadoSolicitud } from './estado-solicitud';

export interface SolicitudResponse {
    id: number;
    cedula: string;
    monto: number;
    plazoMeses: number;
    estado: EstadoSolicitud;
    comentario: string | null;
    fechaCreacion: string;
    fechaActualizacion: string | null;
}
