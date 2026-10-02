import { HttpErrorResponse } from '@angular/common/http';
import { ErrorResponse } from '../models/error-response';

export function extraerMensajeError(error: HttpErrorResponse, mensajePorDefecto: string): string {
    const backendError = error.error as ErrorResponse | undefined;
    const detalle = backendError?.errores?.length ? ` (${backendError.errores.join(', ')})` : '';
    return (backendError?.mensaje ?? mensajePorDefecto) + detalle;
}
