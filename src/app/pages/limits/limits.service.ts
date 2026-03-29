import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country, DeleteRequest, Limit, LimitPayload } from './limits.models';

@Injectable({ providedIn: 'root' })
export class LimitsService {
  private readonly http = inject(HttpClient);

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>('/api/countries');
  }

  getLimits(countryCode: string): Observable<Limit[]> {
    return this.http.get<Limit[]>('/api/limits', { params: { countryCode } });
  }

  createLimit(payload: LimitPayload): Observable<Limit> {
    return this.http.post<Limit>('/api/limits', payload);
  }

  deleteLimit(id: number, body: DeleteRequest): Observable<void> {
    return this.http.delete<void>(`/api/limits/${id}`, { body });
  }
}
