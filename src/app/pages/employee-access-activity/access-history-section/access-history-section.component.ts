import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { AccessHistoryItem } from '../data-access/employee-access-activity.model';
import {
  ACCESS_HISTORY_DETAIL_COLUMNS,
  ACCESS_HISTORY_SUMMARY_FIELDS,
  ACCESS_STATUS_LABELS,
} from '../employee-access-activity.constants';

@Component({
  selector: 'app-access-history-section',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './access-history-section.component.html',
  styleUrl: './access-history-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccessHistorySectionComponent {
  readonly expanded = input.required<boolean>();
  readonly selectedEmployeeId = input<string | null>(null);
  readonly accessHistory = input.required<AccessHistoryItem[]>();
  readonly expandedIds = input.required<number[]>();
  readonly toggleSection = output<void>();
  readonly toggleRow = output<number>();
  protected readonly accessHistorySummaryFields = ACCESS_HISTORY_SUMMARY_FIELDS;
  protected readonly accessHistoryDetailColumns = ACCESS_HISTORY_DETAIL_COLUMNS;
  protected readonly statusLabels = ACCESS_STATUS_LABELS;

  protected onToggleSection(): void {
    this.toggleSection.emit();
  }

  protected onToggleRow(id: number): void {
    this.toggleRow.emit(id);
  }

  protected isRowExpanded(id: number): boolean {
    return this.expandedIds().includes(id);
  }

  protected isEnabled(status: string): boolean {
    return status === 'ENABLED';
  }

  protected isDisabled(status: string): boolean {
    return status === 'DISABLED';
  }
}
