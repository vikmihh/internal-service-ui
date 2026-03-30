import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { SystemActionAuditItem } from '../employee-profile-change-audit.models';

@Component({
  selector: 'app-system-action-details-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDialogModule, MatButtonModule, MatDividerModule],
  templateUrl: './system-action-details-dialog.component.html',
  styleUrl: './system-action-details-dialog.component.scss',
})
export class SystemActionDetailsDialogComponent {
  readonly data = inject<SystemActionAuditItem>(MAT_DIALOG_DATA);
}
