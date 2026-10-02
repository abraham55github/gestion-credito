import { Injectable, computed, signal } from '@angular/core';
import { UsuarioResponse } from '../models/usuario-response';

const CLAVE_TOKEN = 'gestion_credito_token';
const CLAVE_USUARIO = 'gestion_credito_usuario';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));
  private readonly usuarioSignal = signal<UsuarioResponse | null>(SessionService.leerUsuarioGuardado());

  readonly token = this.tokenSignal.asReadonly();
  readonly usuario = this.usuarioSignal.asReadonly();
  readonly autenticado = computed(() => this.tokenSignal() !== null);

  guardarToken(token: string): void {
    localStorage.setItem(CLAVE_TOKEN, token);
    this.tokenSignal.set(token);
  }

  guardarUsuario(usuario: UsuarioResponse): void {
    localStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this.usuarioSignal.set(usuario);
  }

  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    localStorage.removeItem(CLAVE_USUARIO);
    this.tokenSignal.set(null);
    this.usuarioSignal.set(null);
  }

  private static leerUsuarioGuardado(): UsuarioResponse | null {
    const guardado = localStorage.getItem(CLAVE_USUARIO);
    return guardado ? JSON.parse(guardado) : null;
  }
}
