import {  Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreditSideMenu } from '../../components/credit-side-menu/credit-side-menu';
import { CreditBottomNav } from '../../components/credit-bottom-nav/credit-bottom-nav';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, CreditSideMenu, CreditBottomNav],
  templateUrl: './dashboard-page.html'
})
export default class DashboardPage {}
