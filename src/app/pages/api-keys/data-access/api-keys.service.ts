import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import {
  ApiKey,
  CreateApiKeyRequest,
  DeleteApiKeyRequest,
  DeleteApiKeyResponse,
} from './api-keys.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiKeysService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/keys';

  getAll(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>(this.baseUrl);
  }

  create(payload: CreateApiKeyRequest): Observable<ApiKey> {
    return this.http.post<ApiKey>(this.baseUrl, payload);
  }

  delete(id: number, payload: DeleteApiKeyRequest): Observable<DeleteApiKeyResponse> {
    return this.http.request<DeleteApiKeyResponse>('DELETE', `${this.baseUrl}/${id}`, {
      body: payload,
    });
  }
}
