export interface ApiKey {
  id: number;
  createdDate: string;
  usedEmail: string;
  keyValue: string;
  keyFingerprint: string;
}

export interface CreateApiKeyRequest {
  keyValue: string;
}

export interface DeleteApiKeyRequest {
  cancellationReason: string;
}

export interface DeleteApiKeyResponse {
  message: string;
  id: string;
  reason: string;
}
