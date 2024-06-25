import { MatomoTracker } from 'ngx-matomo';
import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';

/**
 *
 */
@Component({
  selector: 'demo-media',
  standalone: true,
  imports: [NgOptimizedImage],
  templateUrl: './media.component.html',
  styleUrls: [],
})
export class MediaComponent {
  private readonly matomoTracker = inject(MatomoTracker);

  onLike(): void {
    console.log('Like!');
    this.matomoTracker.trackEvent('Media', 'Button pressed', 'Like');
  }

  onShare(): void {
    console.log('Share!');
    this.matomoTracker.trackEvent('Media', 'Button pressed', 'Share');
  }
}
