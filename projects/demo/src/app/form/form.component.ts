import { AfterViewInit, Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'demo-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './form.component.html',
  styleUrls: [],
})
export class FormComponent implements AfterViewInit {
  private readonly matomoTracker = inject(MatomoTracker);

  public foodForm = inject(FormBuilder).group({
    favorite: ['', Validators.required],
    comment: [''],
  });

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngAfterViewInit(): void {
    // TODO: To be implemented when Form Analytics will be supported.
    // const form = document.getElementById('foodForm');
    // this.matomoTracker.scanForForms(form);
    // this.matomoTracker.trackForms(form);
  }

  onSubmit(): void {
    this.matomoTracker.trackEvent('FormAnalytics', 'submit', 'form');
  }

  onReset(): void {
    this.matomoTracker.trackEvent('FormAnalytics', 'reset', 'form');
  }
}
