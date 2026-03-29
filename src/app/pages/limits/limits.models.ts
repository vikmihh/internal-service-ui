export enum PeriodType {
  CALENDAR = 'CALENDAR',
  ROLLING = 'ROLLING',
}

export enum PeriodUnit {
  SECONDS = 'SECONDS',
  DAYS = 'DAYS',
  MONTHS = 'MONTHS',
}

export enum UiMessagingType {
  DAILY = 'DAILY',
  MONTHLY = 'MONTHLY',
}

export interface Country {
  code: string;
  name: string;
}

export interface Limit {
  id: number;
  countryCode: string;
  limitName: string;
  periodType: PeriodType;
  periodUnit: PeriodUnit;
  limitAmount: number;
  uiMessagingType: UiMessagingType;
}

export interface LimitPayload {
  countryCode: string;
  limitName: string;
  periodType: PeriodType;
  periodUnit: PeriodUnit;
  limitAmount: number;
  uiMessagingType: UiMessagingType;
}

export interface DeleteRequest {
  cancellationReason: string;
}
