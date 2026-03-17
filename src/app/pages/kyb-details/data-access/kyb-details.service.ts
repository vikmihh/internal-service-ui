import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { KybDetailsRequest, KybDetailsResponse } from './kyb-details.model';

@Injectable({ providedIn: 'root' })
export class KybDetailsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/kyb/details';

  submit(payload: KybDetailsRequest): Observable<KybDetailsResponse> {
    return this.http.post<KybDetailsResponse>(this.baseUrl, payload);
  }
}
