export interface EmployeeOption {
  employeeId: string;
  fullName: string;
  teamCode: string;
  displayLabel: string;
}

export interface AccessHistoryItem {
  id: number;
  status: string;
  team: string;
  tool: string;
  accessPackageId: string;
  accessOwner: string;
  grantedOn: string;
  temporaryAccess: string;
  approvalReminderSent: string;
  accessRenewalReminder: string;
}

export interface SystemActionItem {
  id: number;
  timestamp: string;
  team: string;
  employeeId: string;
  requestId: string;
  action: string;
  accessPackage: string;
  resultCode: number;
}

export interface SystemActionDetails {
  id: number;
  employeeName: string;
  employeeId: string;
  team: string;
  requestId: string;
  action: string;
  accessPackage: string;
  resultCode: number;
  timestamp: string;
}
