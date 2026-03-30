import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  EmployeeProfileOption,
  RecentProfileChangeItem,
  SystemActionAuditItem,
} from './employee-profile-change-audit.models';

@Injectable({ providedIn: 'root' })
export class EmployeeProfileChangeAuditService {
  private readonly http = inject(HttpClient);

  getEmployees(query: string): Observable<EmployeeProfileOption[]> {
    return this.http.get<EmployeeProfileOption[]>('/api/employee-profile-change-audit/employees', {
      params: { query },
    });
  }

  getRecentChanges(employeeId: string): Observable<RecentProfileChangeItem[]> {
    return this.http.get<RecentProfileChangeItem[]>(
      '/api/employee-profile-change-audit/recent-changes',
      { params: { employeeId } },
    );
  }

  getSystemActions(employeeId: string): Observable<SystemActionAuditItem[]> {
    return this.http.get<SystemActionAuditItem[]>(
      '/api/employee-profile-change-audit/system-actions',
      { params: { employeeId } },
    );
  }
}
