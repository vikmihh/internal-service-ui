import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'limits',
    loadComponent: () => import('./pages/limits/limits.component').then((m) => m.LimitsComponent),
  },
  {
    path: 'company-details',
    loadComponent: () =>
      import('./pages/company-details/company-details.component').then(
        (m) => m.CompanyDetailsComponent,
      ),
  },
  { path: '', redirectTo: 'limits', pathMatch: 'full' },
];
