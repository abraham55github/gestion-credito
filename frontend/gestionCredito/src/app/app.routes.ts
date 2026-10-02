import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: 'dashboard',
        loadComponent: () => import('./credit/pages/dashboard-page/dashboard-page'),
        children: [
            {
                path: 'solicitudes',
                loadComponent: () => import('./credit/pages/solicitudes-page/solicitudes-page')
            },
            {
                path: 'nuevas-solicitudes',
                loadComponent: () => import('./credit/pages/nuevas-solicitudes-page/nuevas-solicitudes-page')
            },
            {
                path: '**',
                redirectTo: 'solicitudes'
            }
        ]
    },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
