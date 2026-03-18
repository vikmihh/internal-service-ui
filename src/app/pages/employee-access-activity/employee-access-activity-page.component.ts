import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { forkJoin, map, startWith } from 'rxjs';

import { NotificationService } from '../../shared/service/notification.service';
import {
  AccessHistoryItem,
  EmployeeOption,
  SystemActionItem,
} from './data-access/employee-access-activity.model';
import { EmployeeAccessActivityService } from './data-access/employee-access-activity.service';
import { AccessHistorySectionComponent } from './access-history-section/access-history-section.component';
import { SystemActionsSectionComponent } from './system-actions-section/system-actions-section.component';
import { SYSTEM_ACTION_COLUMNS } from './employee-access-activity.constants';
import { SystemActionDetailsDialogComponent } from './system-action-details-dialog/system-action-details-dialog.component';

type EmployeeControlValue = string | EmployeeOption;
type SystemActionColumnKey =
  | 'timestamp'
  | 'team'
  | 'employeeId'
  | 'requestId'
  | 'action'
  | 'accessPackage'
  | 'resultCode';

type SystemActionFilters = Record<SystemActionColumnKey, string>;

@Component({
  selector: 'app-employee-access-activity-page',
  standalone: true,
  imports: [
    AsyncPipe,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSortModule,
    AccessHistorySectionComponent,
    SystemActionsSectionComponent,
  ],
  templateUrl: './employee-access-activity-page.component.html',
  styleUrl: './employee-access-activity-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeAccessActivityPageComponent {
  @ViewChild(MatSort)
  set tableSort(sort: MatSort) {
    if (sort) {
      this.systemActionsDataSource.sort = sort;
    }
  }

  private readonly fb = inject(FormBuilder);
  private readonly dialog = inject(MatDialog);
  private readonly destroyRef = inject(DestroyRef);
  private readonly employeeAccessActivityService = inject(EmployeeAccessActivityService);
  private readonly notificationService = inject(NotificationService);
  protected readonly employeeControl = this.fb.control<EmployeeControlValue>('');
  protected readonly tableFiltersForm = this.fb.nonNullable.group({
    timestamp: '',
    team: '',
    employeeId: '',
    requestId: '',
    action: '',
    accessPackage: '',
    resultCode: '',
  });

  protected readonly employees = signal<EmployeeOption[]>([]);
  protected readonly accessHistory = signal<AccessHistoryItem[]>([]);
  protected readonly selectedEmployeeId = signal<string | null>(null);
  protected readonly accessHistoryExpanded = signal(true);
  protected readonly systemActionsExpanded = signal(true);
  protected readonly expandedAccessHistoryIds = signal<number[]>([]);
  protected readonly systemActionsDataSource = new MatTableDataSource<SystemActionItem>([]);
  protected readonly filteredEmployees$ = this.employeeControl.valueChanges.pipe(
    startWith(this.employeeControl.value),
    map((value) => this.filterEmployees(this.getEmployeeSearchTerm(value))),
  );

  constructor() {
    this.systemActionsDataSource.sortingDataAccessor = (item, property) =>
      String(item[property as keyof SystemActionItem] ?? '').toLowerCase();
    this.systemActionsDataSource.filterPredicate = (item, rawFilter) => {
      const filter = JSON.parse(rawFilter) as SystemActionFilters;
      return SYSTEM_ACTION_COLUMNS.every((column) =>
        String(item[column.key] ?? '')
          .toLowerCase()
          .includes(filter[column.key].trim().toLowerCase()),
      );
    };
    this.tableFiltersForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.systemActionsDataSource.filter = JSON.stringify(this.tableFiltersForm.getRawValue());
    });
    this.loadEmployees();
  }

  protected displayEmployee(value: EmployeeControlValue | null): string {
    return typeof value === 'string' ? value : (value?.displayLabel ?? '');
  }

  protected search(): void {
    const employeeId = this.resolveEmployeeId(this.employeeControl.value);
    if (!employeeId) {
      this.notificationService.show('Please select a valid employee.');
      return;
    }
    this.selectedEmployeeId.set(employeeId);
    this.expandedAccessHistoryIds.set([]);

    forkJoin({
      accessHistory: this.employeeAccessActivityService.getAccessHistory(employeeId),
      systemActions: this.employeeAccessActivityService.getSystemActions(employeeId),
    })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ({ accessHistory, systemActions }) => {
          this.accessHistory.set(accessHistory);
          this.systemActionsDataSource.data = systemActions;
          this.systemActionsDataSource.filter = JSON.stringify(this.tableFiltersForm.getRawValue());
        },
        error: () => {
          this.notificationService.show('Unable to load employee access activity.');
        },
      });
  }

  protected toggleAccessHistorySection(): void {
    this.accessHistoryExpanded.update((value) => !value);
  }

  protected toggleSystemActionsSection(): void {
    this.systemActionsExpanded.update((value) => !value);
  }

  protected toggleAccessHistoryRow(id: number): void {
    this.expandedAccessHistoryIds.update((ids) =>
      ids.includes(id) ? ids.filter((currentId) => currentId !== id) : [...ids, id],
    );
  }

  protected openDetails(row: SystemActionItem): void {
    this.employeeAccessActivityService
      .getSystemActionDetails(row.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (details) => {
          this.dialog.open(SystemActionDetailsDialogComponent, {
            data: details,
            width: '460px',
            maxWidth: '92vw',
            autoFocus: false,
            panelClass: 'system-action-details-dialog',
          });
        },
        error: () => {
          this.notificationService.show('Unable to load system action details.');
        },
      });
  }

  private loadEmployees(): void {
    this.employeeAccessActivityService
      .getEmployees()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (employees) => this.employees.set(employees),
        error: () => this.notificationService.show('Unable to load employees.'),
      });
  }

  private getEmployeeSearchTerm(value: EmployeeControlValue | null): string {
    return typeof value === 'string' ? value : (value?.displayLabel ?? '');
  }

  private filterEmployees(term: string): EmployeeOption[] {
    const normalizedTerm = term.trim().toLowerCase();
    if (!normalizedTerm) {
      return this.employees();
    }
    return this.employees().filter((employee) =>
      employee.displayLabel.toLowerCase().includes(normalizedTerm),
    );
  }

  private resolveEmployeeId(value: EmployeeControlValue | null): string | null {
    if (!value) {
      return null;
    }
    if (typeof value !== 'string') {
      return value.employeeId;
    }

    const normalizedValue = value.trim().toLowerCase();
    if (!normalizedValue) {
      return null;
    }
    return (
      this.employees().find(
        (employee) =>
          employee.employeeId.toLowerCase() === normalizedValue ||
          employee.displayLabel.toLowerCase() === normalizedValue,
      )?.employeeId ?? null
    );
  }
}
