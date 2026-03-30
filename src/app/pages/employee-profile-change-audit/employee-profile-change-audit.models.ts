export interface EmployeeProfileOption {
  employeeId: string;
  fullName: string;
  teamCode: string;
  displayLabel: string;
}

export interface RecentProfileChangeItem {
  id: number;
  status: string;
  field: string;
  changedFrom: string;
  changedTo: string;
  updatedOn: string;
  modifiedBy: string;
  approvalRequired: string;
}

export interface SystemActionAuditItem {
  id: number;
  timestamp: string;
  field: string;
  modifiedBy: string;
  action: string;
  approvalNeeded: string;
  employeeName: string;
  employeeId: string;
  team: string;
  changedFrom: string;
  changedTo: string;
}
