import { Injectable, computed, signal } from '@angular/core';

const CLAVE_TOKEN = 'gestion_credito_token';

@Injectable({ providedIn: 'root' })
export class SessionService {
  private readonly tokenSignal = signal<string | null>(localStorage.getItem(CLAVE_TOKEN));

  readonly token = this.tokenSignal.asReadonly();
  readonly autenticado = computed(() => this.tokenSignal() !== null);

  guardarToken(token: string): void {
    localStorage.setItem(CLAVE_TOKEN, token);
    this.tokenSignal.set(token);
  }

  cerrarSesion(): void {
    localStorage.removeItem(CLAVE_TOKEN);
    this.tokenSignal.set(null);
  }
}
