import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'limits',
    loadComponent: () => import('./pages/limits/limits.component').then((m) => m.LimitsComponent),
  },
  { path: '', redirectTo: 'limits', pathMatch: 'full' },
];
