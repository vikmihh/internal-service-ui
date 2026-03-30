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
  {
    path: 'employee-profile-change-audit',
    loadComponent: () =>
      import('./pages/employee-profile-change-audit/employee-profile-change-audit.component').then(
        (m) => m.EmployeeProfileChangeAuditComponent,
      ),
  },
  { path: '', redirectTo: 'limits', pathMatch: 'full' },
];
