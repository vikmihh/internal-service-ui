import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LimitsService } from '../limits.service';

interface DialogData {
  limitId: number;
}

const CANCELLATION_REASONS = ['No longer used', 'Deprecated', 'Pause'] as const;

@Component({
  selector: 'app-delete-limit-dialog',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './delete-limit-dialog.component.html',
  styleUrl: './delete-limit-dialog.component.scss',
})
export class DeleteLimitDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<DeleteLimitDialogComponent>);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  private readonly fb = inject(FormBuilder);
  private readonly limitsService = inject(LimitsService);
  private readonly snackBar = inject(MatSnackBar);

  readonly saving = signal(false);
  readonly cancellationReasons = CANCELLATION_REASONS;

  readonly form = this.fb.group({
    cancellationReason: ['', Validators.required],
  });

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.saving.set(true);
    const { cancellationReason } = this.form.getRawValue();

    this.limitsService
      .deleteLimit(this.data.limitId, { cancellationReason: cancellationReason! })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.dialogRef.close(true);
        },
        error: () => {
          this.saving.set(false);
          this.snackBar.open('Failed to delete limit. Please try again.', 'Close', {
            duration: 4000,
          });
        },
      });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
