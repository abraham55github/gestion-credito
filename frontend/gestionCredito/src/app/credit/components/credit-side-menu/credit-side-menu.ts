import {  Component } from '@angular/core';
import { CreditSideMenuHeader } from './credit-side-menu-header/credit-side-menu-header';
import { CreditSideMenuOptions } from './credit-side-menu-options/credit-side-menu-options';

@Component({
  selector: 'credit-side-menu',
  imports: [CreditSideMenuHeader, CreditSideMenuOptions],
  templateUrl: './credit-side-menu.html'
})
export class CreditSideMenu {}
