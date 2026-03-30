import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, forkJoin, of, switchMap } from 'rxjs';
import { NgClass } from '@angular/common';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent,
} from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EmployeeProfileChangeAuditService } from './employee-profile-change-audit.service';
import {
  EmployeeProfileOption,
  RecentProfileChangeItem,
  SystemActionAuditItem,
} from './employee-profile-change-audit.models';
import { SystemActionDetailsDialogComponent } from './system-action-details-dialog/system-action-details-dialog.component';

@Component({
  selector: 'app-employee-profile-change-audit',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressBarModule,
    MatTableModule,
    MatSortModule,
  ],
  templateUrl: './employee-profile-change-audit.component.html',
  styleUrl: './employee-profile-change-audit.component.scss',
})
export class EmployeeProfileChangeAuditComponent {
  private readonly service = inject(EmployeeProfileChangeAuditService);
  private readonly dialog = inject(MatDialog);

  readonly searchControl = new FormControl<EmployeeProfileOption | string>('');

  readonly selectedEmployee = signal<EmployeeProfileOption | null>(null);
  readonly loading = signal(false);
  readonly recentChanges = signal<RecentProfileChangeItem[]>([]);
  readonly systemActions = signal<SystemActionAuditItem[]>([]);
  readonly hasSearched = signal(false);

  readonly recentChangesExpanded = signal(true);
  readonly systemActionsExpanded = signal(true);
  readonly expandedRowIds = signal<Set<number>>(new Set());

  readonly sortState = signal<Sort>({ active: '', direction: '' });
  readonly columnFilters = signal<Record<string, string>>({
    timestamp: '',
    field: '',
    modifiedBy: '',
    action: '',
    approvalNeeded: '',
  });

  readonly displayedColumns = [
    'timestamp',
    'field',
    'modifiedBy',
    'action',
    'approvalNeeded',
    'viewAction',
  ];

  readonly filterColumns = [
    'f_timestamp',
    'f_field',
    'f_modifiedBy',
    'f_action',
    'f_approvalNeeded',
    'f_viewAction',
  ];

  readonly autocompleteOptions = toSignal(
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((value) => {
        const query = typeof value === 'string' ? value : '';
        return query.length >= 2
          ? this.service.getEmployees(query).pipe(catchError(() => of([])))
          : of([]);
      }),
    ),
    { initialValue: [] as EmployeeProfileOption[] },
  );

  readonly filteredSortedActions = computed(() => {
    const filters = this.columnFilters();
    const sort = this.sortState();
    let data = [...this.systemActions()];

    data = data.filter(
      (row) =>
        row.timestamp.toLowerCase().includes(filters['timestamp'].toLowerCase()) &&
        row.field.toLowerCase().includes(filters['field'].toLowerCase()) &&
        row.modifiedBy.toLowerCase().includes(filters['modifiedBy'].toLowerCase()) &&
        row.action.toLowerCase().includes(filters['action'].toLowerCase()) &&
        row.approvalNeeded.toLowerCase().includes(filters['approvalNeeded'].toLowerCase()),
    );

    if (sort.active && sort.direction) {
      data.sort((a, b) => {
        const valA = String(a[sort.active as keyof SystemActionAuditItem]);
        const valB = String(b[sort.active as keyof SystemActionAuditItem]);
        const cmp = valA.localeCompare(valB);
        return sort.direction === 'asc' ? cmp : -cmp;
      });
    }

    return data;
  });

  displayFn(value: EmployeeProfileOption | string | null): string {
    if (!value) return '';
    if (typeof value === 'string') return value;
    return value.displayLabel;
  }

  onInputChange(): void {
    this.selectedEmployee.set(null);
    this.recentChanges.set([]);
    this.systemActions.set([]);
    this.hasSearched.set(false);
  }

  onEmployeeSelected(event: MatAutocompleteSelectedEvent): void {
    const option = event.option.value as EmployeeProfileOption;
    this.selectedEmployee.set(option);
    this.recentChanges.set([]);
    this.systemActions.set([]);
    this.hasSearched.set(false);
  }

  search(): void {
    const employee = this.selectedEmployee();
    if (!employee) return;

    this.loading.set(true);
    this.hasSearched.set(true);
    this.expandedRowIds.set(new Set());

    forkJoin({
      recentChanges: this.service
        .getRecentChanges(employee.employeeId)
        .pipe(catchError(() => of([] as RecentProfileChangeItem[]))),
      systemActions: this.service
        .getSystemActions(employee.employeeId)
        .pipe(catchError(() => of([] as SystemActionAuditItem[]))),
    }).subscribe({
      next: ({ recentChanges, systemActions }) => {
        this.recentChanges.set(recentChanges);
        this.systemActions.set(systemActions);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  toggleRecentChanges(): void {
    this.recentChangesExpanded.update((v) => !v);
  }

  toggleSystemActions(): void {
    this.systemActionsExpanded.update((v) => !v);
  }

  toggleRow(id: number): void {
    this.expandedRowIds.update((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  isRowExpanded(id: number): boolean {
    return this.expandedRowIds().has(id);
  }

  onSortChange(sort: Sort): void {
    this.sortState.set(sort);
  }

  setColumnFilter(column: string, event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.columnFilters.update((filters) => ({ ...filters, [column]: value }));
  }

  openDetails(row: SystemActionAuditItem): void {
    this.dialog.open(SystemActionDetailsDialogComponent, {
      data: row,
      width: '500px',
      panelClass: 'audit-dialog',
    });
  }
}
