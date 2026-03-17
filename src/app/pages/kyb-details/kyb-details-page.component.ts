import { ChangeDetectionStrategy, Component, inject, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroupDirective, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  AGE_RANGE_OPTIONS,
  COUNTRY_OPTIONS,
  EMPTY_FORM_VALUE,
  FIELD_MAX_LENGTH,
  YES_NO_OPTIONS,
} from './kyb-details.constants';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { finalize } from 'rxjs';

import { PageShellComponent } from '../../shared/page-shell/page-shell.component';
import { KybDetailsRequest } from './data-access/kyb-details.model';
import { KybDetailsService } from './data-access/kyb-details.service';
import { NotificationService } from '../../shared/service/notification.service';

@Component({
  selector: 'app-kyb-details-page',
  standalone: true,
  imports: [
    PageShellComponent,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
  ],
  templateUrl: './kyb-details-page.component.html',
  styleUrl: './kyb-details-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KybDetailsPageComponent {
  @ViewChild(FormGroupDirective) private formDirective?: FormGroupDirective;

  private readonly fb = inject(FormBuilder);
  private readonly kybDetailsService = inject(KybDetailsService);
  private readonly notificationService = inject(NotificationService);

  protected readonly submitting = signal(false);
  protected readonly ageRangeOptions = AGE_RANGE_OPTIONS;
  protected readonly countryOptions = COUNTRY_OPTIONS;
  protected readonly yesNoOptions = YES_NO_OPTIONS;

  protected readonly form = this.fb.group({
    serviceName: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(FIELD_MAX_LENGTH.serviceName),
    ]),
    targetAgeRange: this.fb.nonNullable.control('', Validators.required),
    serviceUrl: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(FIELD_MAX_LENGTH.serviceUrl),
    ]),
    businessModelOverview: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(FIELD_MAX_LENGTH.businessModelOverview),
    ]),
    serviceLicenseType: this.fb.nonNullable.control('', [
      Validators.maxLength(FIELD_MAX_LENGTH.serviceLicenseType),
    ]),
    licenseNumber: this.fb.nonNullable.control('', [
      Validators.maxLength(FIELD_MAX_LENGTH.licenseNumber),
    ]),
    licensePlaceOfIssue: this.fb.nonNullable.control('', [
      Validators.maxLength(FIELD_MAX_LENGTH.licensePlaceOfIssue),
    ]),

    ownedByAnotherCompany: this.fb.control<boolean | null>(null, Validators.required),
    parentCompanyName: this.fb.nonNullable.control(''),
    registeredAddress: this.fb.nonNullable.control(''),
    cityOrTown: this.fb.nonNullable.control(''),
    stateOrCounty: this.fb.nonNullable.control(''),
    postalCode: this.fb.nonNullable.control(''),
    country: this.fb.nonNullable.control(''),

    publiclyTraded: this.fb.control<boolean | null>(null, Validators.required),
    governmentOrStateOwned: this.fb.control<boolean | null>(null, Validators.required),
    hasShareholdersAboveTenPercent: this.fb.control<boolean | null>(null, Validators.required),
    hasUltimateBeneficialOwner: this.fb.control<boolean | null>(null, Validators.required),
    hasPepInvolved: this.fb.control<boolean | null>(null, Validators.required),
  });

  constructor() {
    this.form.controls.ownedByAnotherCompany.valueChanges.subscribe((owned) => {
      this.setParentCompanyValidators(owned === true);
    });
  }

  protected submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.submitting.set(true);
    this.kybDetailsService
      .submit(this.buildPayload())
      .pipe(finalize(() => this.submitting.set(false)))
      .subscribe({
        next: ({ message }) => {
          this.formDirective?.resetForm(EMPTY_FORM_VALUE);
          this.setParentCompanyValidators(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
          this.notificationService.show(message);
        },
        error: () => {
          this.notificationService.show('Something went wrong, please try again.');
        },
      });
  }

  protected showParentCompanyFields(): boolean {
    return this.form.controls.ownedByAnotherCompany.value === true;
  }

  private setParentCompanyValidators(required: boolean): void {
    this.form.controls.parentCompanyName.setValidators(
      required
        ? [Validators.required, Validators.maxLength(FIELD_MAX_LENGTH.parentCompanyName)]
        : [],
    );
    this.form.controls.registeredAddress.setValidators(
      required
        ? [Validators.required, Validators.maxLength(FIELD_MAX_LENGTH.registeredAddress)]
        : [],
    );
    this.form.controls.cityOrTown.setValidators(
      required ? [Validators.required, Validators.maxLength(FIELD_MAX_LENGTH.cityOrTown)] : [],
    );
    this.form.controls.stateOrCounty.setValidators(
      required ? [Validators.required, Validators.maxLength(FIELD_MAX_LENGTH.stateOrCounty)] : [],
    );
    this.form.controls.postalCode.setValidators(
      required ? [Validators.required, Validators.maxLength(FIELD_MAX_LENGTH.postalCode)] : [],
    );
    this.form.controls.country.setValidators(required ? [Validators.required] : []);
  }

  private buildPayload(): KybDetailsRequest {
    const raw = this.form.getRawValue();
    return {
      serviceName: raw.serviceName,
      targetAgeRange: raw.targetAgeRange,
      serviceUrl: raw.serviceUrl,
      businessModelOverview: raw.businessModelOverview,
      serviceLicenseType: raw.serviceLicenseType,
      licenseNumber: raw.licenseNumber,
      licensePlaceOfIssue: raw.licensePlaceOfIssue,
      ownedByAnotherCompany: raw.ownedByAnotherCompany as boolean,
      parentCompanyName: raw.parentCompanyName,
      registeredAddress: raw.registeredAddress,
      cityOrTown: raw.cityOrTown,
      stateOrCounty: raw.stateOrCounty,
      postalCode: raw.postalCode,
      country: raw.country,
      publiclyTraded: raw.publiclyTraded as boolean,
      governmentOrStateOwned: raw.governmentOrStateOwned as boolean,
      hasShareholdersAboveTenPercent: raw.hasShareholdersAboveTenPercent as boolean,
      hasUltimateBeneficialOwner: raw.hasUltimateBeneficialOwner as boolean,
      hasPepInvolved: raw.hasPepInvolved as boolean,
    };
  }
}
