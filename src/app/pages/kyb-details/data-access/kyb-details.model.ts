export interface KybDetailsRequest {
  serviceName: string;
  targetAgeRange: string;
  serviceUrl: string;
  businessModelOverview: string;
  serviceLicenseType?: string;
  licenseNumber?: string;
  licensePlaceOfIssue?: string;
  ownedByAnotherCompany: boolean;
  parentCompanyName?: string;
  registeredAddress?: string;
  cityOrTown?: string;
  stateOrCounty?: string;
  postalCode?: string;
  country?: string;
  publiclyTraded: boolean;
  governmentOrStateOwned: boolean;
  hasShareholdersAboveTenPercent: boolean;
  hasUltimateBeneficialOwner: boolean;
  hasPepInvolved: boolean;
}

export interface KybDetailsResponse {
  status: number;
  message: string;
}
