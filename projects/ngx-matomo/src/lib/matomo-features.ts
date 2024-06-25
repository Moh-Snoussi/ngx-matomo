import {
  MatomoRouteTrackingConfiguration,
  MatomoTrackers,
  MatomoTrackingConfiguration,
} from './matomo-configuration';

export type MatomoFeature =
  | { kind: 'EXTERNAL_TRACKER' }
  | { kind: 'DUMMY_TRACKER' }
  | {
      kind: 'TRACKER_INJECTION';
      parameters: Promise<Partial<MatomoTrackers>>;
    }
  | {
      kind: 'TRACKING_CONFIGURATION';
      parameters: Partial<MatomoTrackingConfiguration>;
    }
  | {
      kind: 'ROUTE_TRACKING';
      parameters: Partial<MatomoRouteTrackingConfiguration>;
    }
  | { kind: 'DEBUG_TRACING' };

/**
 * Require a Matomo script to be loaded and trackers to be set.
 *
 * @param trackers
 * @param {string} configuration.scriptUrl URL of the Matomo JS script to execute.
 * @param configuration.trackers list of trackers to register
 * @param {string} configuration.trackers[].trackerUrl URL of the tracker to register
 * @param {number} configuration.trackers[].siteId Website Id of the tracker to register
 *
 * @returns feature request for Matomo tracking
 */
export function withTrackers(
  trackers: Partial<MatomoTrackers> | Promise<Partial<MatomoTrackers>>,
): MatomoFeature {
  return {
    kind: 'TRACKER_INJECTION',
    parameters: Promise.resolve(trackers).then((it) => ({ trackers: [], ...it })),
  };
}

export function withExternalTracker(): MatomoFeature {
  return { kind: 'EXTERNAL_TRACKER' };
}

export function withDummyTracker(): MatomoFeature {
  return { kind: 'DUMMY_TRACKER' };
}

export function withConfig(configuration: Partial<MatomoTrackingConfiguration>): MatomoFeature {
  return { kind: 'TRACKING_CONFIGURATION', parameters: configuration };
}

export function withRouteTracking(
  configuration: Partial<MatomoRouteTrackingConfiguration>,
): MatomoFeature {
  return { kind: 'ROUTE_TRACKING', parameters: configuration };
}

export function withDebugTracing(): MatomoFeature {
  return { kind: 'DEBUG_TRACING' };
}
