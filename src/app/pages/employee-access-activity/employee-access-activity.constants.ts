export const SYSTEM_ACTION_COLUMNS = [
  { key: 'timestamp', label: 'Timestamp' },
  { key: 'team', label: 'Team' },
  { key: 'employeeId', label: 'Employee ID' },
  { key: 'requestId', label: 'Request ID' },
  { key: 'action', label: 'Action' },
  { key: 'accessPackage', label: 'Access Package' },
  { key: 'resultCode', label: 'Result Code' },
] as const;

export const ACCESS_STATUS_LABELS: Readonly<Record<string, string>> = {
  ENABLED: 'Enabled',
  DISABLED: 'Disabled',
};

export const ACCESS_HISTORY_SUMMARY_FIELDS = [
  { key: 'team', label: 'Team' },
  { key: 'tool', label: 'Tool' },
  { key: 'accessPackageId', label: 'Access Package ID' },
  { key: 'grantedOn', label: 'Granted On' },
] as const;

export const ACCESS_HISTORY_DETAIL_COLUMNS = [
  [
    { key: 'team', label: 'Team' },
    { key: 'tool', label: 'Tool' },
    { key: 'accessPackageId', label: 'Access Package ID' },
    { key: 'accessOwner', label: 'Access Owner' },
  ],
  [
    { key: 'grantedOn', label: 'Granted On' },
    { key: 'temporaryAccess', label: 'Temporary Access' },
    { key: 'approvalReminderSent', label: 'Approval Reminder Sent' },
    { key: 'accessRenewalReminder', label: 'Access Renewal Reminder' },
  ],
] as const;

export const SYSTEM_ACTION_DETAIL_LABELS = {
  employeeName: 'Employee Name',
  employeeId: 'Employee ID',
  team: 'Team',
  requestId: 'Request ID',
  action: 'Action',
  accessPackage: 'Access Package',
  resultCode: 'Result Code',
  timestamp: 'Timestamp',
} as const;
