import { NgModule, ModuleWithProviders, Inject, PLATFORM_ID, Injector } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  MatomoConfiguration,
  MATOMO_CONFIGURATION,
  sanitizeConfiguration,
  SanitizedMatomoConfiguration,
  SANITIZED_MATOMO_CONFIGURATION,
} from './matomo-configuration';
import { MatomoInjector } from './matomo-injector.service';
import { MatomoTracker } from './matomo-tracker.service';
import { MatomoRouteTracker } from './matomo-route-tracker.service';
import { BehaviorSubject } from 'rxjs';

declare global {
  /**
   * Extend Window interface in order to introduce the Matomo _paq attribute
   */
  interface Window {
    _paq: any;
  }
}

/**
 * Angular module encapsulating Matomo features.
 */
@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [MatomoInjector, MatomoTracker, MatomoRouteTracker],
})
export class MatomoModule {
  /**
   * Creates an instance of Matomo module.
   *
   * @param platformId Angular platform provided by DI.
   * @param injector Instance of Angular Injector provided by DI.
   * @param configuration Matomo configuration provided by DI.
   * @param matomoInjector Instance of MatomoInjector provided by DI.
   */
  constructor(
    @Inject(PLATFORM_ID) private readonly platformId: Object,
    private readonly injector: Injector,
    @Inject(MATOMO_CONFIGURATION)
    private readonly configuration: Promise<Partial<MatomoConfiguration>>,
    private readonly matomoInjector: MatomoInjector
  ) {
    // Warn if module is not being loaded by a browser.
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('ngx-Matomo does not support server platform');
    }
    if (window['_paq'] === undefined) {
      window['_paq'] = [];
    }
    this.configuration.then(sanitizeConfiguration).then(
      (config) => {
        switch (config?.mode) {
          // @ts-expect-error
          case 'ACTIVE':
            window['_paq'] = [];
            // Inject the Matomo script and create trackers.
            this.matomoInjector.init(config);
          case 'PRELOADED':
            try {
              if (config?.requireConsent === true) {
                window['_paq'].push(['requireConsent']);
              } else if (config?.requireCookieConsent === true) {
                window['_paq'].push(['requireCookieConsent']);
              }
              if (config?.skipTrackingInitialPageView === false) {
                window['_paq'].push(['trackPageView']);
                if (config?.trackLinks === true && config?.routeTracking?.enable === false) {
                  setTimeout(() => {
                    window['_paq'].push(['enableLinkTracking', config?.trackLinkValue ?? false]);
                  }, 0);
                }
              }
              if (config.trackers?.length) {
                const [mainTracker, ...otherTrackers] = config.trackers;
                window['_paq'].push(['setTrackerUrl', mainTracker.trackerUrl]);
                window['_paq'].push(['setSiteId', mainTracker.siteId.toString()]);
                otherTrackers.forEach((tracker) =>
                  window['_paq'].push(['addTracker', tracker.trackerUrl, tracker.siteId.toString()])
                );
              }
              // Enable route tracking if requested.
              if (config?.routeTracking?.enable === true) {
                // Using Injector instead of DI in order to allow use in routerless apps.
                this.injector.get(MatomoRouteTracker).startTracking();
              }
            } catch (e) {
              if (!(e instanceof ReferenceError)) {
                throw e;
              }
            }
            break;
          case 'INACTIVE':
            window['_paq'] = { push: () => {} };
            break;
        }
      },
      (err) => {}
    );
  }

  /**
   * Use this method in your root module to provide the MatomoTracker service.
   */
  static forRoot(
    configuration?: Promise<Partial<MatomoConfiguration>> | Partial<MatomoConfiguration>
  ): ModuleWithProviders<MatomoModule> {
    return {
      ngModule: MatomoModule,
      providers: [
        {
          provide: MATOMO_CONFIGURATION,
          useValue: Promise.resolve(configuration),
        },
        {
          provide: SANITIZED_MATOMO_CONFIGURATION,
          useValue: new BehaviorSubject<SanitizedMatomoConfiguration | null>(null),
        },
        MatomoTracker,
        MatomoRouteTracker,
      ],
    };
  }
}
