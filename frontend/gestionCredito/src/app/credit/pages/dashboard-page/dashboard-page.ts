import {  Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CreditSideMenu } from '../../components/credit-side-menu/credit-side-menu';

@Component({
  selector: 'app-dashboard-page',
  imports: [RouterOutlet, CreditSideMenu],
  templateUrl: './dashboard-page.html'
})
export default class DashboardPage {}
