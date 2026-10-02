import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { SessionService } from '../../../../auth/services/session.service';

@Component({
  selector: 'credit-side-menu-header',
  imports: [],
  templateUrl: './credit-side-menu-header.html'
})
export class CreditSideMenuHeader {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  envs = environment;

  readonly nombreCompleto = computed(() => {
    const usuario = this.session.usuario();
    return usuario ? `${usuario.nombre} ${usuario.apellido}` : 'Usuario';
  });

  cerrarSesion(): void {
    this.session.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}
