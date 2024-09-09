import { InjectionToken } from '@angular/core';
type ClickTrackingOption = 'NONE' | 'LEFT_CLICK_ONLY' | 'LEFT_MIDDLE_RIGHT_CLICKS';
export type MatomoConsentRequirement = 'NONE' | 'COOKIE' | 'TRACKING';
export type MatomoRouteData = {
    tracking?: 'AUTO' | 'OFF';
    title?: string;
    idRegExp?: RegExp;
};
export type MatomoTrackers = {
    /**
     * URL of the Matomo JS script to execute.
     */
    scriptUrl?: string;
    /**
     * Array of trackers, each one of them being described by its URL and site id.
     */
    trackers: {
        trackerUrl: string;
        siteId: number;
    }[];
};
export declare const defaultTrackers: Promise<MatomoTrackers>;
export type MatomoTrackingConfiguration = {
    disableCrossDomainLinking?: boolean;
    disableCookies?: boolean;
    secureCookie?: boolean;
    cookieDomain?: string;
    cookiePath?: string;
    cookieSameSite?: 'Lax' | 'Strict' | 'None';
    doNotUserSendBeacon?: boolean;
    detectBrowserFeatures?: boolean;
    enableDoNotTrack?: boolean;
    consentRequirement?: MatomoConsentRequirement;
    trackJavaScriptErrors?: boolean;
    localDomains?: string[];
    heartBeatTimer?: number;
    customDimensions?: {
        index: number;
        value: string;
    }[];
    disableCampaignParametersTracking?: boolean;
};
export declare const defaultTrackingConfiguration: MatomoTrackingConfiguration;
export type MatomoRouteTrackingConfiguration = {
    linkTracking: ClickTrackingOption;
    clearIds: boolean;
    idRegExp?: RegExp;
    idReplacement?: string;
    clearMatrixParams: boolean;
    clearQueryParams: boolean;
    clearHash: boolean;
};
export declare const defaultRouteTrackingConfiguration: MatomoRouteTrackingConfiguration;
/**
 * Injection token for internal Matomo trackers.
 */
export declare const MATOMO_TRACKERS_INTERNAL_CONFIGURATION: InjectionToken<MatomoTrackers>;
/**
 * Injection token for internal Matomo tracking configuration.
 */
export declare const MATOMO_TRACKING_INTERNAL_CONFIGURATION: InjectionToken<MatomoTrackingConfiguration>;
/**
 * Injection token for internal Matomo route tracking configuration.
 */
export declare const MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION: InjectionToken<MatomoRouteTrackingConfiguration>;
/**
 * Injection token for Matomo debug tracing.
 */
export declare const MATOMO_DEBUG_TRACING: InjectionToken<boolean>;
export {};
