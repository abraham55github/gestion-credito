import { Routes } from '@angular/router';
import { authGuard } from './auth/services/auth.guard';

export const routes: Routes = [

    {
        path: 'login',
        loadComponent: () => import('./auth/pages/login-page/login-page').then(m => m.LoginPage),
    },
    {
        path: 'register',
        loadComponent: () => import('./auth/pages/register-page/register-page').then(m => m.RegisterPage),
    },
    {
        path: 'dashboard',
        canActivate: [authGuard],
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
