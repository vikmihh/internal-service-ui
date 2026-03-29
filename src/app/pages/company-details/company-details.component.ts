import {
  ChangeDetectionStrategy,
  Component,
  Signal,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { COUNTRIES, CompanyDetailsRequest, CountryOption } from './company-details.models';
import { CompanyDetailsService } from './company-details.service';

function urlValidator(control: AbstractControl): ValidationErrors | null {
  const val = control.value as string;
  if (!val) return null;
  try {
    const href = val.startsWith('http://') || val.startsWith('https://') ? val : `https://${val}`;
    const url = new URL(href);
    return url.protocol === 'http:' || url.protocol === 'https:' ? null : { url: true };
  } catch {
    return { url: true };
  }
}

@Component({
  selector: 'app-company-details',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatDividerModule,
  ],
  providers: [provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'en-GB' }],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.scss',
})
export class CompanyDetailsComponent {
  private readonly service = inject(CompanyDetailsService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly formDirective = viewChild(FormGroupDirective);

  readonly countries: readonly CountryOption[] = COUNTRIES;
  readonly submitting = signal(false);

  readonly form = new FormGroup({
    companyName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
    companyRegistrationCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    }),
    taxIdNumber: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(50)],
    }),
    corporateUrl: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, urlValidator, Validators.maxLength(2048)],
    }),
    dateOfIncorporation: new FormControl<Date | null>(null, {
      validators: [Validators.required],
    }),
    registeredAddress: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(200)],
    }),
    cityOrTown: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)],
    }),
    stateOrCounty: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(100)],
    }),
    postalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(20)],
    }),
    country: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    primaryContactName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(2), Validators.maxLength(100)],
    }),
    primaryContactPhone: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(/^\+?[0-9\s-]{7,20}$/)],
    }),
    primaryContactEmail: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(254)],
    }),
    hasTermsAndConditions: new FormControl<boolean>(true, { nonNullable: true }),
    termsAndConditionsUrl: new FormControl('', { nonNullable: true }),
    hasPrivacyPolicy: new FormControl<boolean>(true, { nonNullable: true }),
    privacyPolicyUrl: new FormControl('', { nonNullable: true }),
  });

  readonly showTnCUrl: Signal<boolean>;
  readonly showPrivacyUrl: Signal<boolean>;
  readonly formInvalid: Signal<boolean>;

  constructor() {
    this.showTnCUrl = toSignal(this.form.controls.hasTermsAndConditions.valueChanges, {
      initialValue: true,
    });
    this.showPrivacyUrl = toSignal(this.form.controls.hasPrivacyPolicy.valueChanges, {
      initialValue: true,
    });
    this.formInvalid = toSignal(this.form.statusChanges.pipe(map((s) => s !== 'VALID')), {
      initialValue: true,
    });

    effect(() => {
      const ctrl = this.form.controls.termsAndConditionsUrl;
      if (this.showTnCUrl()) {
        ctrl.setValidators([Validators.required, urlValidator, Validators.maxLength(2048)]);
      } else {
        ctrl.clearValidators();
        ctrl.reset('');
      }
      ctrl.updateValueAndValidity();
    });

    effect(() => {
      const ctrl = this.form.controls.privacyPolicyUrl;
      if (this.showPrivacyUrl()) {
        ctrl.setValidators([Validators.required, urlValidator, Validators.maxLength(2048)]);
      } else {
        ctrl.clearValidators();
        ctrl.reset('');
      }
      ctrl.updateValueAndValidity();
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.submitting.set(true);
    const payload = this.buildPayload();
    this.service.submit(payload).subscribe({
      next: () => {
        this.submitting.set(false);
        this.snackBar.open('Company details submitted successfully.', 'Close', { duration: 4000 });
        this.formDirective()?.resetForm({ hasTermsAndConditions: true, hasPrivacyPolicy: true });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.submitting.set(false);
        this.snackBar.open('Failed to submit company details. Please try again.', 'Close', {
          duration: 4000,
        });
      },
    });
  }

  private buildPayload(): CompanyDetailsRequest {
    const v = this.form.getRawValue();
    const date = v.dateOfIncorporation;
    const dateStr = date
      ? `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`
      : '';

    return {
      companyName: v.companyName,
      companyRegistrationCode: v.companyRegistrationCode,
      taxIdNumber: v.taxIdNumber,
      corporateUrl: v.corporateUrl,
      dateOfIncorporation: dateStr,
      registeredAddress: v.registeredAddress,
      cityOrTown: v.cityOrTown,
      stateOrCounty: v.stateOrCounty,
      postalCode: v.postalCode,
      country: v.country,
      primaryContactName: v.primaryContactName,
      primaryContactPhone: v.primaryContactPhone,
      primaryContactEmail: v.primaryContactEmail,
      hasTermsAndConditions: v.hasTermsAndConditions,
      termsAndConditionsUrl: v.hasTermsAndConditions ? v.termsAndConditionsUrl : undefined,
      hasPrivacyPolicy: v.hasPrivacyPolicy,
      privacyPolicyUrl: v.hasPrivacyPolicy ? v.privacyPolicyUrl : undefined,
    };
  }
}
