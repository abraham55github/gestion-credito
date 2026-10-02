import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../../auth/services/session.service';

@Component({
  selector: 'credit-bottom-nav',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './credit-bottom-nav.html'
})
export class CreditBottomNav {
  private readonly session = inject(SessionService);
  private readonly router = inject(Router);

  cerrarSesion(): void {
    this.session.cerrarSesion();
    this.router.navigateByUrl('/login');
  }
}
