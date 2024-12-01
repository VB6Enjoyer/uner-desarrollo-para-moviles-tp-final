import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/login/register/register.page').then(m => m.RegisterPage)
  },
  {
    path: 'tabs',
    loadComponent: () => import('./pages/tabs/tabs.page').then(m => m.TabsPage),
    children: [
      
      {
        path: 'home',
        loadComponent: () => import('./pages/tabs/home/home.page').then(m => m.HomePage)
      },
      {
        path: 'profile',
        loadComponent: () => import('./pages/tabs/profile/profile.page').then(m => m.ProfilePage),
      },

      {
        path: 'settings',
        loadComponent: () => import('./pages/tabs/settings/settings.page').then(m => m.SettingsPage)
      },
      {
        path: 'mapa',
        loadComponent: () => import('./pages/tabs/mapa/google-maps/google-maps.page').then( m => m.GoogleMapsPage),
      },
      {
        path: 'redes',
        loadComponent: () => import('./pages/tabs/settings/redes/redes.page').then( m => m.RedesPage),
      },
    ]
  },
  { path: '**', redirectTo: 'login' },

];
