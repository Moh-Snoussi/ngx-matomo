import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { ENVIRONMENT_INITIALIZER, PLATFORM_ID, Provider } from '@angular/core';

import {
  MATOMO_DEBUG_TRACING,
  MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION,
  MATOMO_TRACKERS_INTERNAL_CONFIGURATION,
  MATOMO_TRACKING_INTERNAL_CONFIGURATION,
  MatomoRouteTrackingConfiguration,
  MatomoTrackers,
  MatomoTrackingConfiguration,
  defaultRouteTrackingConfiguration,
  defaultTrackers,
  defaultTrackingConfiguration,
} from './matomo-configuration';
import { MatomoFeature } from './matomo-features';
import {
  MATOMO_TRACKER_GET_FUNCTION,
  MATOMO_TRACKER_INVOKE_FUNCTION,
  MATOMO_TRACKER_SET_FUNCTION,
  getFunctionFactory,
  invokeFunctionFactory,
  setFunctionFactory,
} from './matomo-functions';
import { injectMatomoTrackingScriptFactory } from './matomo-inject-tracking-script';
import { MatomoRouteTracker } from './matomo-route-tracker.service';
import { MatomoTracker } from './matomo-tracker.service';

declare global {
  /**
   * Extend Window interface in order to introduce the Matomo _paq attribute
   */
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Window {
    _paq: { push: (args: unknown[]) => void };
  }
}

/**
 * Prepares Matomo tracking by returning a list of providers.
 *
 * @param {...*} features List of features to include in order to provide the correct list of providers.
 * @returns providers required for Matomo tracking.
 */
export function provideMatomoTracking(...features: MatomoFeature[]) {
  if (
    features.filter((it) =>
      ['TRACKER_INJECTION', 'EXTERNAL_TRACKER', 'DUMMY_TRACKER'].includes(it.kind),
    ).length > 1
  ) {
    console.error('One and one only tracker configuration must be used.');
    return [];
  }

  try {
    window['_paq'] =
      window['_paq'] ||
      (features.find((it) => it.kind === 'TRACKER_INJECTION') ||
      features.find((it) => it.kind === 'EXTERNAL_TRACKER')
        ? []
        : // eslint-disable-next-line @typescript-eslint/no-empty-function
          { push: () => {} });
  } catch (e) {
    if (!(e instanceof ReferenceError)) throw e;
  }

  const providers: Provider[] = [MatomoTracker];

  const debugTracingFeature = features.find((it) => it.kind === 'DEBUG_TRACING');
  providers.push({
    provide: MATOMO_DEBUG_TRACING,
    useValue: !!debugTracingFeature,
  });

  const routeTrackingFeature = features.find((it) => it.kind === 'ROUTE_TRACKING') as
    | {
        kind: 'ROUTE_TRACKING';
        parameters: Partial<MatomoRouteTrackingConfiguration>;
      }
    | undefined;
  if (routeTrackingFeature) {
    providers.push(
      {
        provide: ENVIRONMENT_INITIALIZER,
        useFactory: (matomoRouteTracker: MatomoRouteTracker) => () => {
          matomoRouteTracker.startTracking();
        },
        deps: [MatomoRouteTracker],
        multi: true,
      },
      {
        provide: MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION,
        useValue: {
          ...defaultRouteTrackingConfiguration,
          ...routeTrackingFeature?.parameters,
        },
      },
    );
  }

  const trackingConfigurationFeature = features.find(
    (it) => it.kind === 'TRACKING_CONFIGURATION',
  ) as
    | {
        kind: 'TRACKING_CONFIGURATION';
        parameters: Partial<MatomoTrackingConfiguration>;
      }
    | undefined;
  if (trackingConfigurationFeature) {
    providers.push(
      {
        provide: ENVIRONMENT_INITIALIZER,
        useFactory: (matomoTracker: MatomoTracker) => () => {
          // Disable use of sendBeacon for transmitting tracked events
          if (trackingConfigurationFeature.parameters.doNotUserSendBeacon)
            matomoTracker.disableAlwaysUseSendBeacon();

          // Disable cookies if specified
          if (trackingConfigurationFeature.parameters.disableCookies)
            matomoTracker.disableCookies();

          // Disable cross domain linking if specified
          // TODO: investigate how this is done with GTM parameters.
          // if (trackingConfigurationFeature.parameters.disableCrossDomainLinking)
          //   matomoTracker.disableCrossDomainLinking();

          // Set cookie domain if specified
          if (trackingConfigurationFeature.parameters.cookieDomain)
            matomoTracker.setCookieDomain(trackingConfigurationFeature.parameters.cookieDomain);

          // Set cookie path if specified
          if (trackingConfigurationFeature.parameters.cookiePath)
            matomoTracker.setCookiePath(trackingConfigurationFeature.parameters.cookiePath);

          // Set cookie same site if specified
          if (trackingConfigurationFeature.parameters.cookieSameSite)
            matomoTracker.setCookieSameSite(trackingConfigurationFeature.parameters.cookieSameSite);

          // Set secure cookies if specified
          if (trackingConfigurationFeature.parameters.secureCookie)
            matomoTracker.setSecureCookie(true);

          // Enable Browser Feature Detection if specified
          if (trackingConfigurationFeature.parameters.detectBrowserFeatures)
            matomoTracker.enableBrowserFeatureDetection();

          // Enable JavaScript error tracking (as events)
          if (trackingConfigurationFeature.parameters.trackJavaScriptErrors)
            matomoTracker.enableJSErrorTracking();

          // Enable Heart Beat Timer if specified
          if (typeof trackingConfigurationFeature.parameters.heartBeatTimer !== 'number')
            matomoTracker.enableHeartBeatTimer(
              trackingConfigurationFeature.parameters.heartBeatTimer,
            );

          // Set local domains
          if (Array.isArray(trackingConfigurationFeature.parameters.localDomains))
            matomoTracker.setDomains(trackingConfigurationFeature.parameters.localDomains);

          // Enable DoNotTrack
          if (trackingConfigurationFeature.parameters.enableDoNotTrack)
            matomoTracker.setDoNotTrack(true);

          // Require the right consent
          if (trackingConfigurationFeature.parameters?.consentRequirement === 'TRACKING')
            matomoTracker.requireConsent();
          else if (trackingConfigurationFeature.parameters?.consentRequirement === 'COOKIE')
            matomoTracker.requireCookieConsent();

          // Set global custom dimensions
          trackingConfigurationFeature.parameters.customDimensions?.forEach((it) => {
            matomoTracker.setCustomDimension(it.index, it.value);
          });

          // Disable Campaign Parameters Tracking
          if (trackingConfigurationFeature.parameters.disableCampaignParametersTracking)
            matomoTracker.disableCampaignParameters();
        },
        deps: [MatomoTracker],
        multi: true,
      },
      {
        provide: MATOMO_TRACKING_INTERNAL_CONFIGURATION,
        useValue: {
          ...defaultTrackingConfiguration,
          ...trackingConfigurationFeature?.parameters,
        },
      },
    );
  }

  const mockedTrackerFeature = features.find((it) => it.kind === 'DUMMY_TRACKER');
  if (mockedTrackerFeature) {
    // TODO: Changer l'injection des fonctions set / get / invoke
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const preloadedTrackerFeature = features.find((it) => it.kind === 'EXTERNAL_TRACKER');

  const trackerInjectionFeature = features.find((it) => it.kind === 'TRACKER_INJECTION') as
    | {
        kind: 'TRACKER_INJECTION';
        parameters: Promise<Partial<MatomoTrackers>>;
      }
    | undefined;
  if (trackerInjectionFeature) {
    providers.push({
      provide: ENVIRONMENT_INITIALIZER,
      useFactory:
        (trackers: Promise<MatomoTrackers>, document: Document, debugTracing: boolean) => () =>
          trackers.then(injectMatomoTrackingScriptFactory(document, debugTracing))
        ,
      deps: [MATOMO_TRACKERS_INTERNAL_CONFIGURATION, DOCUMENT, MATOMO_DEBUG_TRACING],
      multi: true,
    });
  }

  return [
    ...providers,
    {
      provide: MATOMO_TRACKERS_INTERNAL_CONFIGURATION,
      useFactory: () =>
        Promise.all([defaultTrackers, trackerInjectionFeature?.parameters]).then(
          ([defaultTrackers, trackers]) => ({
            ...defaultTrackers,
            ...trackers,
          }),
        ),
    },
    {
      provide: ENVIRONMENT_INITIALIZER,
      useFactory: (platformId: object) => () => {
        if (!isPlatformBrowser(platformId))
          console.warn('ngx-Matomo is active only on browser platform.');
      },
      deps: [PLATFORM_ID],
      multi: true,
    },
    {
      provide: MATOMO_TRACKER_SET_FUNCTION,
      useFactory: (platformId: object, debugTracing: boolean) =>
        setFunctionFactory(!isPlatformBrowser(platformId), debugTracing),
      deps: [PLATFORM_ID, MATOMO_DEBUG_TRACING],
    },
    {
      provide: MATOMO_TRACKER_GET_FUNCTION,
      useFactory: (platformId: object, debugTracing: boolean) =>
        getFunctionFactory(!isPlatformBrowser(platformId), debugTracing),
      deps: [PLATFORM_ID],
    },
    {
      provide: MATOMO_TRACKER_INVOKE_FUNCTION,
      useFactory: (platformId: object, debugTracing: boolean) =>
        invokeFunctionFactory(!isPlatformBrowser(platformId), debugTracing),
      deps: [PLATFORM_ID],
    },
  ];
}
