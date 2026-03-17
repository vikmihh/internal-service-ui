export const AGE_RANGE_OPTIONS = ['13+', '16+', '18+', '21+', 'All ages'] as const;

export const COUNTRY_OPTIONS = [
  'Estonia',
  'Latvia',
  'Lithuania',
  'Finland',
  'Sweden',
  'Germany',
  'United Kingdom',
  'United States',
] as const;

export const YES_NO_OPTIONS = [
  { label: 'No', value: false },
  { label: 'Yes', value: true },
] as const;

export const FIELD_MAX_LENGTH = {
  serviceName: 120,
  serviceUrl: 2048,
  businessModelOverview: 1000,
  serviceLicenseType: 100,
  licenseNumber: 100,
  licensePlaceOfIssue: 100,
  parentCompanyName: 150,
  registeredAddress: 200,
  cityOrTown: 100,
  stateOrCounty: 100,
  postalCode: 20,
} as const;

export const EMPTY_FORM_VALUE = {
  serviceName: '',
  targetAgeRange: '',
  serviceUrl: '',
  businessModelOverview: '',
  serviceLicenseType: '',
  licenseNumber: '',
  licensePlaceOfIssue: '',
  ownedByAnotherCompany: null,
  parentCompanyName: '',
  registeredAddress: '',
  cityOrTown: '',
  stateOrCounty: '',
  postalCode: '',
  country: '',
  publiclyTraded: null,
  governmentOrStateOwned: null,
  hasShareholdersAboveTenPercent: null,
  hasUltimateBeneficialOwner: null,
  hasPepInvolved: null,
} as const;
