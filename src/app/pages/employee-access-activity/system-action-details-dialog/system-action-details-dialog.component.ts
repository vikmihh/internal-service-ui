import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';

import { SystemActionDetails } from '../data-access/employee-access-activity.model';
import { SYSTEM_ACTION_DETAIL_LABELS } from '../employee-access-activity.constants';

type DetailRow = Readonly<{
  label: string;
  value: string;
}>;

@Component({
  selector: 'app-system-action-details-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  templateUrl: './system-action-details-dialog.component.html',
  styleUrl: './system-action-details-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemActionDetailsDialogComponent {
  private readonly data = inject<SystemActionDetails>(MAT_DIALOG_DATA);

  protected readonly detailRows: readonly DetailRow[] = [
    { label: SYSTEM_ACTION_DETAIL_LABELS.employeeName, value: this.data.employeeName },
    { label: SYSTEM_ACTION_DETAIL_LABELS.employeeId, value: this.data.employeeId },
    { label: SYSTEM_ACTION_DETAIL_LABELS.team, value: this.data.team },
    { label: SYSTEM_ACTION_DETAIL_LABELS.requestId, value: this.data.requestId },
    { label: SYSTEM_ACTION_DETAIL_LABELS.action, value: this.data.action },
    { label: SYSTEM_ACTION_DETAIL_LABELS.accessPackage, value: this.data.accessPackage },
    { label: SYSTEM_ACTION_DETAIL_LABELS.resultCode, value: String(this.data.resultCode) },
    { label: SYSTEM_ACTION_DETAIL_LABELS.timestamp, value: this.data.timestamp },
  ];
}
