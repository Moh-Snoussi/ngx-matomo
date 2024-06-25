import { Component, inject } from '@angular/core';

import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'demo-event',
  standalone: true,
  templateUrl: './event.component.html',
  styleUrls: [],
})
export class EventComponent {
  private readonly matomoTracker = inject(MatomoTracker);

  /**
   * Handles the click on the 'Click Me' button.
   */
  onClick(): void {
    console.log('Button has been pressed!');
    this.matomoTracker.trackEvent('Event', 'Button pressed', 'cta');
  }
}
