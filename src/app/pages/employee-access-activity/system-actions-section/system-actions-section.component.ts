import {
  ChangeDetectionStrategy,
  Component,
  input,
  OnChanges,
  output,
  ViewChild,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { SystemActionItem } from '../data-access/employee-access-activity.model';
import { SYSTEM_ACTION_COLUMNS } from '../employee-access-activity.constants';

type SystemActionFiltersForm = FormGroup<{
  timestamp: FormControl<string>;
  team: FormControl<string>;
  employeeId: FormControl<string>;
  requestId: FormControl<string>;
  action: FormControl<string>;
  accessPackage: FormControl<string>;
  resultCode: FormControl<string>;
}>;

@Component({
  selector: 'app-system-actions-section',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './system-actions-section.component.html',
  styleUrl: './system-actions-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SystemActionsSectionComponent implements OnChanges {
  @ViewChild(MatSort)
  set tableSort(sort: MatSort) {
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  readonly expanded = input.required<boolean>();
  readonly selectedEmployeeId = input<string | null>(null);
  readonly systemActions = input.required<SystemActionItem[]>();
  readonly tableFiltersForm = input.required<SystemActionFiltersForm>();
  readonly toggleSection = output<void>();
  readonly openDetails = output<SystemActionItem>();
  protected readonly systemActionColumns = SYSTEM_ACTION_COLUMNS;
  protected readonly displayedColumns = [...SYSTEM_ACTION_COLUMNS.map(({ key }) => key), 'view'];
  protected readonly filterColumns = [
    ...SYSTEM_ACTION_COLUMNS.map(({ key }) => `${key}Filter`),
    'viewFilter',
  ];

  protected readonly dataSource = new MatTableDataSource<SystemActionItem>([]);

  constructor() {
    this.dataSource.sortingDataAccessor = (item, property) => {
      if (property === 'resultCode') {
        return item.resultCode;
      }
      return String(item[property as keyof SystemActionItem] ?? '').toLowerCase();
    };

    this.dataSource.filterPredicate = (item, rawFilter) => {
      const filter = JSON.parse(rawFilter) as Record<string, string>;
      return SYSTEM_ACTION_COLUMNS.every((column) =>
        String(item[column.key] ?? '')
          .toLowerCase()
          .includes((filter[column.key] ?? '').trim().toLowerCase()),
      );
    };
  }

  ngOnChanges(): void {
    this.dataSource.data = this.systemActions();
    this.dataSource.filter = JSON.stringify(this.tableFiltersForm().getRawValue());
  }

  protected onToggleSection(): void {
    this.toggleSection.emit();
  }

  protected onOpenDetails(row: SystemActionItem): void {
    this.openDetails.emit(row);
  }

  protected trackBySystemActionId(_: number, row: SystemActionItem): number {
    return row.id;
  }
}
