import { MatomoTrackers } from './matomo-configuration';

export function injectMatomoTrackingScriptFactory(document: Document, debugTracing = false) {
  return (configuration: MatomoTrackers) => {
    if (!configuration.scriptUrl || !configuration.trackers?.length) return;
    try {
      if (debugTracing)
        console.debug(
          '\x1B[1mngx-Matomo\x1B[m • 💉 Inject Matomo.js script in DOM for',
          configuration,
        );
      const [mainTracker, ...otherTrackers] = configuration.trackers;
      window['_paq'].push(['setTrackerUrl', mainTracker.trackerUrl]);
      window['_paq'].push(['setSiteId', mainTracker.siteId.toString()]);
      otherTrackers.forEach((tracker) =>
        window['_paq'].push(['addTracker', tracker.trackerUrl, tracker.siteId.toString()]),
      );
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.defer = true;
      script.src = configuration.scriptUrl!;
      const firstScript = document.getElementsByTagName('script')[0];
      firstScript.parentNode?.insertBefore(script, firstScript);
    } catch (e) {
      if (!(e instanceof ReferenceError)) throw e;
    }
  };
}
