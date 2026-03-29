import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Country, Limit } from './limits.models';
import { LimitsService } from './limits.service';
import { AddLimitDialogComponent } from './add-limit-dialog/add-limit-dialog.component';
import { DeleteLimitDialogComponent } from './delete-limit-dialog/delete-limit-dialog.component';

@Component({
  selector: 'app-limits',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TitleCasePipe,
    MatTableModule,
    MatSelectModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatDividerModule,
  ],
  templateUrl: './limits.component.html',
  styleUrl: './limits.component.scss',
})
export class LimitsComponent implements OnInit {
  private readonly limitsService = inject(LimitsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly countries = signal<Country[]>([]);
  readonly limits = signal<Limit[]>([]);
  readonly loading = signal(false);
  readonly selectedCountryCode = signal<string | null>(null);

  readonly displayedColumns = [
    'limitName',
    'periodType',
    'periodUnit',
    'limitAmount',
    'uiMessagingType',
    'actions',
  ];

  ngOnInit(): void {
    this.limitsService.getCountries().subscribe({
      next: (countries) => {
        this.countries.set(countries);
        if (countries.length > 0) {
          this.selectedCountryCode.set(countries[0].code);
          this.fetchLimits(countries[0].code);
        }
      },
    });
  }

  onCountryChange(code: string): void {
    this.selectedCountryCode.set(code);
    this.fetchLimits(code);
  }

  openAddDialog(): void {
    const countryCode = this.selectedCountryCode();
    if (!countryCode) return;

    const ref = this.dialog.open(AddLimitDialogComponent, {
      data: { countryCode },
      width: '480px',
    });

    ref.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.snackBar.open('Limit created successfully.', 'Close', { duration: 3000 });
        this.fetchLimits(countryCode);
      }
    });
  }

  openDeleteDialog(limit: Limit): void {
    const ref = this.dialog.open(DeleteLimitDialogComponent, {
      data: { limitId: limit.id },
      width: '420px',
    });

    ref.afterClosed().subscribe((success: boolean) => {
      if (success) {
        this.snackBar.open('Limit deleted successfully.', 'Close', { duration: 3000 });
        const code = this.selectedCountryCode();
        if (code) this.fetchLimits(code);
      }
    });
  }

  private fetchLimits(countryCode: string): void {
    this.loading.set(true);
    this.limitsService.getLimits(countryCode).subscribe({
      next: (limits) => {
        this.limits.set(limits);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
