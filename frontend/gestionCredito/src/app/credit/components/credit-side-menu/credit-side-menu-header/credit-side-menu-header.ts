import {  Component } from '@angular/core';
import { environment } from '@environments/environment';

@Component({
  selector: 'credit-side-menu-header',
  imports: [],
  templateUrl: './credit-side-menu-header.html'
})
export class CreditSideMenuHeader {
  envs = environment

}
