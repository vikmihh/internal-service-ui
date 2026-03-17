import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { finalize, map, startWith } from 'rxjs';

import { ApiKeysService } from '../data-access/api-keys.service';
import { ApiKey } from '../data-access/api-keys.model';
import { buildApiKeyFingerprint } from '../util/api-key-fingerprint.util';

type FingerprintState = 'empty' | 'valid' | 'invalid';

@Component({
  selector: 'app-add-api-key-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './add-api-key-dialog.component.html',
  styleUrl: './add-api-key-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddApiKeyDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);
  private readonly dialogRef = inject(MatDialogRef<AddApiKeyDialogComponent, ApiKey | undefined>);
  private readonly apiKeysService = inject(ApiKeysService);

  readonly saving = signal(false);
  readonly errorMessage = signal('');

  readonly form = this.fb.nonNullable.group({
    keyValue: ['', [Validators.required]],
  });

  readonly keyValue = toSignal(
    this.form.controls.keyValue.valueChanges.pipe(
      startWith(this.form.controls.keyValue.value),
      map((value) => value.trim()),
    ),
    { initialValue: '' },
  );

  readonly fingerprintPreview = computed(() => {
    const key = this.keyValue();
    if (!key) {
      return '';
    }

    try {
      return buildApiKeyFingerprint(key);
    } catch {
      return '';
    }
  });

  readonly fingerprintState = computed<FingerprintState>(() => {
    const key = this.keyValue();
    if (!key) {
      return 'empty';
    }

    return this.fingerprintPreview() ? 'valid' : 'invalid';
  });

  readonly canSave = computed(() => !this.saving() && this.fingerprintState() === 'valid');

  close(): void {
    if (!this.saving()) {
      this.dialogRef.close();
    }
  }

  save(): void {
    if (this.form.invalid || this.saving()) {
      this.form.markAllAsTouched();
      return;
    }

    const keyValue = this.form.controls.keyValue.value.trim();
    if (!keyValue) {
      this.form.controls.keyValue.setErrors({ required: true });
      this.form.controls.keyValue.markAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.saving.set(true);

    this.apiKeysService
      .create({ keyValue })
      .pipe(
        finalize(() => this.saving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (created) => this.dialogRef.close(created),
        error: (error: unknown) => this.errorMessage.set(this.getCreateErrorMessage(error)),
      });
  }

  private getCreateErrorMessage(error: unknown): string {
    const response = error as {
      error?: {
        fieldErrors?: { keyValue?: string };
        error?: string;
        message?: string;
      };
    };

    return (
      response?.error?.fieldErrors?.keyValue ??
      response?.error?.error ??
      response?.error?.message ??
      'Failed to save the API key. Check the key and try again.'
    );
  }
}
