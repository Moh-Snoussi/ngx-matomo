import { Component, OnInit, inject, signal } from '@angular/core';

import { MatomoTracker } from 'ngx-matomo';

@Component({
  selector: 'demo-consent',
  standalone: true,
  templateUrl: './consent.component.html',
  styleUrls: [],
})
export class ConsentComponent implements OnInit {
  private readonly matomoTracker = inject(MatomoTracker);
  public isTrackingConsentRequired = signal(false);
  public isTrackingConsentGiven = signal(false);
  public isCookieConsentGiven = signal(false);
  public hasCookies = signal(false);

  public readonly giveConsentCode = 'this.matomoTracker.setConsentGiven();';
  public readonly removeConsentCode = 'this.matomoTracker.forgetConsentGiven();';
  public readonly hasCookiesCode = 'this.matomoTracker.hasCookies().then(console.log);';

  ngOnInit(): void {
    this.update();
  }

  onGiveTrackingConsent(): void {
    this.matomoTracker.setConsentGiven();
    this.isTrackingConsentGiven.set(true);
    this.update();
  }

  onRemoveTrackingConsent(): void {
    this.matomoTracker.forgetConsentGiven();
    this.isTrackingConsentGiven.set(false);
    this.update();
  }

  onGiveCookieConsent(): void {
    this.matomoTracker.setCookieConsentGiven();
    this.isCookieConsentGiven.set(true);
    this.update();
  }

  onRemoveCookieConsent(): void {
    this.matomoTracker.forgetCookieConsentGiven();
    this.isCookieConsentGiven.set(false);
    this.update();
  }

  private update() {
    this.matomoTracker.hasCookies().then(this.hasCookies.set);
    // this.matomoTracker.isConsentRequired().then(this.isTrackingConsentRequired.set);
  }
}
