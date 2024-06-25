import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';

import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'demo-welcome',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './welcome.component.html',
  styleUrls: [],
})
export class WelcomeComponent {
  private readonly matomoTracker = inject(MatomoTracker);
  matomoUrl: Promise<string> = this.matomoTracker.getMatomoUrl();
}
