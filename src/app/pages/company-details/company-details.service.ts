import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CompanyDetailsRequest } from './company-details.models';

@Injectable({ providedIn: 'root' })
export class CompanyDetailsService {
  private readonly http = inject(HttpClient);

  submit(payload: CompanyDetailsRequest): Observable<void> {
    return this.http.post<void>('/api/company/details', payload);
  }
}
