import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('./pages/api-keys/api-keys-page.component').then((m) => m.ApiKeysPageComponent),
  },
];
