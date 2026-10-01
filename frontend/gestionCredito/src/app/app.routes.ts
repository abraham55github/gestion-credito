import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'dashboard',
        loadComponent: () => import('./credit/pages/dashboard-page/dashboard-page'), 
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
