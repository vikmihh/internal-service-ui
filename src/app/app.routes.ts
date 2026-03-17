import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'api-keys',
  },
  {
    path: 'api-keys',
    loadComponent: () =>
      import('./pages/api-keys/api-keys-page.component').then((m) => m.ApiKeysPageComponent),
  },
  {
    path: 'kyb-details',
    loadComponent: () =>
      import('./pages/kyb-details/kyb-details-page.component').then(
        (m) => m.KybDetailsPageComponent,
      ),
  },
];
