import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  AccessHistoryItem,
  EmployeeOption,
  SystemActionDetails,
  SystemActionItem,
} from './employee-access-activity.model';

@Injectable({ providedIn: 'root' })
export class EmployeeAccessActivityService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/employee-access-activity';

  getEmployees(): Observable<EmployeeOption[]> {
    return this.http.get<EmployeeOption[]>(`${this.baseUrl}/employees`);
  }

  getAccessHistory(employeeId: string): Observable<AccessHistoryItem[]> {
    return this.http.get<AccessHistoryItem[]>(`${this.baseUrl}/access-history`, {
      params: { employeeId },
    });
  }

  getSystemActions(employeeId: string): Observable<SystemActionItem[]> {
    return this.http.get<SystemActionItem[]>(`${this.baseUrl}/system-actions`, {
      params: { employeeId },
    });
  }

  getSystemActionDetails(id: number): Observable<SystemActionDetails> {
    return this.http.get<SystemActionDetails>(`${this.baseUrl}/system-actions/${id}`);
  }
}
