import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleCasePipe } from '@angular/common';
import { PeriodType, PeriodUnit, UiMessagingType } from '../limits.models';
import { LimitsService } from '../limits.service';

interface DialogData {
  countryCode: string;
}

@Component({
  selector: 'app-add-limit-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TitleCasePipe,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './add-limit-dialog.component.html',
  styleUrl: './add-limit-dialog.component.scss',
})
export class AddLimitDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddLimitDialogComponent>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly limitsService = inject(LimitsService);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving = signal(false);

  readonly periodTypes = Object.values(PeriodType);
  readonly periodUnits = Object.values(PeriodUnit);
  readonly uiMessagingTypes = Object.values(UiMessagingType);

  readonly form = this.fb.group({
    limitName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    periodType: ['' as PeriodType | '', [Validators.required]],
    periodUnit: ['' as PeriodUnit | '', [Validators.required]],
    limitAmount: [
      null as number | null,
      [Validators.required, Validators.min(1), Validators.max(999999)],
    ],
    uiMessagingType: ['' as UiMessagingType | '', [Validators.required]],
  });

  get countryCode(): string {
    return this.data.countryCode;
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const v = this.form.getRawValue();

    this.limitsService
      .createLimit({
        countryCode: this.data.countryCode,
        limitName: v.limitName!,
        periodType: v.periodType as PeriodType,
        periodUnit: v.periodUnit as PeriodUnit,
        limitAmount: v.limitAmount!,
        uiMessagingType: v.uiMessagingType as UiMessagingType,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving.set(false);
          this.snackBar.open('Failed to create limit. Please try again.', 'Close', {
            duration: 4000,
          });
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
