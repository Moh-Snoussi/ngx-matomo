import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { filter, map, pairwise } from 'rxjs/operators';
import { MATOMO_DEBUG_TRACING, MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION, } from './matomo-configuration';
import { MatomoTracker } from './matomo-tracker.service';
import * as i0 from "@angular/core";
const DefaultIdRegExp = new RegExp([
    '\\d{8,}', // Numerical
    '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}', // UUID / GUID
    '[a-f\\d]{24}', // MongodDb Id
    '[0-7][0-9A-HJKMNP-TV-Z]{25}', // ULID
    'c[a-z0-9]{24}', // CUID
    '[A-Za-z0-9_-]{21}', // NanoID
].join('|'), 'g');
/**
 * Service for tracking route changes.
 *
 * @export
 */
export class MatomoRouteTracker {
    constructor() {
        this.previousRouteKey = null;
        this.routeTrackingConfiguration = inject(MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION);
        this.debugTracing = inject(MATOMO_DEBUG_TRACING);
        this.matomoTracker = inject(MatomoTracker);
        this.router = inject(Router);
        this.activatedRoute = inject(ActivatedRoute);
        this.titleService = inject(Title);
        this.document = inject(DOCUMENT);
    }
    /**
     * Starts tracking route changes.
     * Matomo DocumentTitle will be set with the `title` or `data.matomo.title` of your routes.
     *
     * This service shall not be used directly within an application.
     */
    startTracking() {
        if (this.debugTracing)
            console.debug('\x1B[1mngx-Matomo\x1B[m • 🚨 Start tracking route changes…');
        this.subscription = this.router.events
            .pipe(filter((event) => event instanceof NavigationStart || event instanceof NavigationEnd), map((event) => ({
            timestamp: new Date().getTime(),
            event,
        })), pairwise(), filter(([a, b]) => a.event instanceof NavigationStart && b.event instanceof NavigationEnd))
            .subscribe({
            next: ([start, end]) => {
                if (this.debugTracing)
                    console.groupCollapsed('\x1B[1mngx-Matomo\x1B[m • 🚧 New Route change occurrence');
                if (this.debugTracing)
                    console.debug('\x1B[1mngx-Matomo\x1B[m • 🔎 Found NavigationStart event', start.event);
                if (this.debugTracing)
                    console.debug('\x1B[1mngx-Matomo\x1B[m • 🔎 Found NavigationEnd event', end.event);
                const locationUrl = new URL(this.document.location.href);
                // Check that the significant part of the location has changed before tracking anything
                const currentRouteKey = this.routeTrackingConfiguration.clearMatrixParams
                    ? locationUrl.href.replace(/;[\w,%]+=[\w,%]+/g, '')
                    : locationUrl.href + this.routeTrackingConfiguration.clearQueryParams
                        ? ''
                        : locationUrl.search + this.routeTrackingConfiguration.clearHash
                            ? ''
                            : locationUrl.hash;
                if (currentRouteKey === this.previousRouteKey) {
                    return;
                }
                this.previousRouteKey = currentRouteKey;
                if (this.debugTracing)
                    console.debug('\x1B[1mngx-Matomo\x1B[m • 🔎 Activated route', this.activatedRoute);
                let currentRoute = this.activatedRoute.snapshot.root;
                while (currentRoute.firstChild) {
                    // if (this.debugTracing)
                    //   console.debug('\x1B[1mngx-Matomo\x1B[m • 🔎 Candidate route snapshot', currentRoute);
                    currentRoute = currentRoute.firstChild;
                }
                if (this.debugTracing)
                    console.debug('\x1B[1mngx-Matomo\x1B[m • 🔎 Current route snapshot', currentRoute);
                // Check that the route is not marked as not to be tracked
                if (currentRoute.data['matomo']?.tracking === 'OFF')
                    return;
                // Set referrer if appropriate
                if (start.event.id === 1)
                    this.matomoTracker.setReferrerUrl(this.document.referrer);
                // Set custom URL for tracking
                const customUrl = (this.routeTrackingConfiguration.clearMatrixParams
                    ? locationUrl.href.replace(/;[\w,%]+=[\w,%]+/g, '')
                    : locationUrl.href) +
                    (this.routeTrackingConfiguration.clearQueryParams ? '' : locationUrl.search) +
                    (this.routeTrackingConfiguration.clearHash ? '' : locationUrl.hash);
                this.matomoTracker.setCustomUrl(this.routeTrackingConfiguration.clearIds
                    ? customUrl.replace(currentRoute.data['matomo']?.idRegExp instanceof RegExp
                        ? currentRoute.data['matomo']?.idRegExp
                        : this.routeTrackingConfiguration?.idRegExp instanceof RegExp
                            ? this.routeTrackingConfiguration?.idRegExp
                            : DefaultIdRegExp, this.routeTrackingConfiguration.idReplacement)
                    : customUrl);
                // Remove all previously assigned custom variables
                this.matomoTracker.deleteCustomVariables('page');
                // Track page performance timing
                // TODO: Improve performance tracking
                this.matomoTracker.setPagePerformanceTiming(undefined, undefined, undefined, undefined, end.timestamp - start.timestamp, undefined);
                // Track page view
                if (currentRoute.data['matomo']?.title)
                    this.matomoTracker.trackPageView(currentRoute.data['matomo']?.title);
                else
                    this.matomoTracker.trackPageView();
                if (this.routeTrackingConfiguration.linkTracking !== 'NONE')
                    this.matomoTracker.enableLinkTracking(this.routeTrackingConfiguration.linkTracking === 'LEFT_CLICK_ONLY' ? false : true);
                if (this.debugTracing)
                    console.groupEnd();
            },
        });
    }
    /**
     * Stops tracking route changes.
     */
    stopTracking() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = undefined;
        }
    }
    /**
     * Angular OnDestroy lifecycle hook.
     */
    ngOnDestroy() {
        this.stopTracking();
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.3", ngImport: i0, type: MatomoRouteTracker, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.3", ngImport: i0, type: MatomoRouteTracker, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.3", ngImport: i0, type: MatomoRouteTracker, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0b21vLXJvdXRlLXRyYWNrZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1tYXRvbW8vc3JjL2xpYi9tYXRvbW8tcm91dGUtdHJhY2tlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxRQUFRLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUMzQyxPQUFPLEVBQUUsVUFBVSxFQUFhLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUM5RCxPQUFPLEVBQUUsS0FBSyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDbEQsT0FBTyxFQUFFLGNBQWMsRUFBRSxhQUFhLEVBQUUsZUFBZSxFQUFFLE1BQU0sRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBR3pGLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRXZELE9BQU8sRUFDTCxvQkFBb0IsRUFDcEIsNENBQTRDLEdBQzdDLE1BQU0sd0JBQXdCLENBQUM7QUFDaEMsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLDBCQUEwQixDQUFDOztBQUV6RCxNQUFNLGVBQWUsR0FBRyxJQUFJLE1BQU0sQ0FDaEM7SUFDRSxTQUFTLEVBQUUsWUFBWTtJQUN2Qiw4REFBOEQsRUFBRSxjQUFjO0lBQzlFLGNBQWMsRUFBRSxjQUFjO0lBQzlCLDZCQUE2QixFQUFFLE9BQU87SUFDdEMsZUFBZSxFQUFFLE9BQU87SUFDeEIsbUJBQW1CLEVBQUUsU0FBUztDQUMvQixDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFDWCxHQUFHLENBQ0osQ0FBQztBQUVGOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sa0JBQWtCO0lBRC9CO1FBRVUscUJBQWdCLEdBQWtCLElBQUksQ0FBQztRQUM5QiwrQkFBMEIsR0FBRyxNQUFNLENBQ2xELDRDQUE0QyxDQUM3QyxDQUFDO1FBQ2UsaUJBQVks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QzVDLENBQUM7U0FDRixDQUFDLENBQUM7SUFDUCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxZQUFZO1FBQ1YsSUFBSSxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFDdEIsSUFBSSxDQUFDLFlBQVksQ0FBQyxXQUFXLEVBQUUsQ0FBQztZQUNoQyxJQUFJLENBQUMsWUFBWSxHQUFHLFNBQVMsQ0FBQztRQUNoQyxDQUFDO0lBQ0gsQ0FBQztJQUVEOztPQUVHO0lBQ0gsV0FBVztRQUNULElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztJQUN0QixDQUFDOzhHQTVJVSxrQkFBa0I7a0hBQWxCLGtCQUFrQixjQURMLE1BQU07OzJGQUNuQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xuaW1wb3J0IHsgSW5qZWN0YWJsZSwgT25EZXN0cm95LCBpbmplY3QgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7IFRpdGxlIH0gZnJvbSAnQGFuZ3VsYXIvcGxhdGZvcm0tYnJvd3Nlcic7XG5pbXBvcnQgeyBBY3RpdmF0ZWRSb3V0ZSwgTmF2aWdhdGlvbkVuZCwgTmF2aWdhdGlvblN0YXJ0LCBSb3V0ZXIgfSBmcm9tICdAYW5ndWxhci9yb3V0ZXInO1xuXG5pbXBvcnQgeyBTdWJzY3JpcHRpb24gfSBmcm9tICdyeGpzJztcbmltcG9ydCB7IGZpbHRlciwgbWFwLCBwYWlyd2lzZSB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcblxuaW1wb3J0IHtcbiAgTUFUT01PX0RFQlVHX1RSQUNJTkcsXG4gIE1BVE9NT19ST1VURV9UUkFDS0lOR19JTlRFUk5BTF9DT05GSUdVUkFUSU9OLFxufSBmcm9tICcuL21hdG9tby1jb25maWd1cmF0aW9uJztcbmltcG9ydCB7IE1hdG9tb1RyYWNrZXIgfSBmcm9tICcuL21hdG9tby10cmFja2VyLnNlcnZpY2UnO1xuXG5jb25zdCBEZWZhdWx0SWRSZWdFeHAgPSBuZXcgUmVnRXhwKFxuICBbXG4gICAgJ1xcXFxkezgsfScsIC8vIE51bWVyaWNhbFxuICAgICdbMC05YS1mXXs4fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXs0fS1bMC05YS1mXXsxMn0nLCAvLyBVVUlEIC8gR1VJRFxuICAgICdbYS1mXFxcXGRdezI0fScsIC8vIE1vbmdvZERiIElkXG4gICAgJ1swLTddWzAtOUEtSEpLTU5QLVRWLVpdezI1fScsIC8vIFVMSURcbiAgICAnY1thLXowLTldezI0fScsIC8vIENVSURcbiAgICAnW0EtWmEtejAtOV8tXXsyMX0nLCAvLyBOYW5vSURcbiAgXS5qb2luKCd8JyksXG4gICdnJyxcbik7XG5cbi8qKlxuICogU2VydmljZSBmb3IgdHJhY2tpbmcgcm91dGUgY2hhbmdlcy5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTWF0b21vUm91dGVUcmFja2VyIGltcGxlbWVudHMgT25EZXN0cm95IHtcbiAgcHJpdmF0ZSBwcmV2aW91c1JvdXRlS2V5OiBzdHJpbmcgfCBudWxsID0gbnVsbDtcbiAgcHJpdmF0ZSByZWFkb25seSByb3V0ZVRyYWNraW5nQ29uZmlndXJhdGlvbiA9IGluamVjdChcbiAgICBNQVRPTU9fUk9VVEVfVFJBQ0tJTkdfSU5URVJOQUxfQ09ORklHVVJBVElPTixcbiAgKTtcbiAgcHJpdmF0ZSByZWFkb25seSBkZWJ1Z1RyYWNpbmcgPSBpbmplY3QoTUFUT01PX0RFQlVHX1RSQUNJTkcpO1xuICBwcml2YXRlIHJlYWRvbmx5IG1hdG9tb1RyYWNrZXIgPSBpbmplY3QoTWF0b21vVHJhY2tlcik7XG4gIHByaXZhdGUgcmVhZG9ubHkgcm91dGVyID0gaW5qZWN0KFJvdXRlcik7XG4gIHByaXZhdGUgcmVhZG9ubHkgYWN0aXZhdGVkUm91dGUgPSBpbmplY3QoQWN0aXZhdGVkUm91dGUpO1xuICBwcml2YXRlIHJlYWRvbmx5IHRpdGxlU2VydmljZSA9IGluamVjdChUaXRsZSk7XG4gIHByaXZhdGUgcmVhZG9ubHkgZG9jdW1lbnQgPSBpbmplY3QoRE9DVU1FTlQpO1xuICBwcml2YXRlIHN1YnNjcmlwdGlvbj86IFN1YnNjcmlwdGlvbjtcblxuICAvKipcbiAgICogU3RhcnRzIHRyYWNraW5nIHJvdXRlIGNoYW5nZXMuXG4gICAqIE1hdG9tbyBEb2N1bWVudFRpdGxlIHdpbGwgYmUgc2V0IHdpdGggdGhlIGB0aXRsZWAgb3IgYGRhdGEubWF0b21vLnRpdGxlYCBvZiB5b3VyIHJvdXRlcy5cbiAgICpcbiAgICogVGhpcyBzZXJ2aWNlIHNoYWxsIG5vdCBiZSB1c2VkIGRpcmVjdGx5IHdpdGhpbiBhbiBhcHBsaWNhdGlvbi5cbiAgICovXG4gIHN0YXJ0VHJhY2tpbmcoKTogdm9pZCB7XG4gICAgaWYgKHRoaXMuZGVidWdUcmFjaW5nKVxuICAgICAgY29uc29sZS5kZWJ1ZygnXFx4MUJbMW1uZ3gtTWF0b21vXFx4MUJbbSDigKIg8J+aqCBTdGFydCB0cmFja2luZyByb3V0ZSBjaGFuZ2Vz4oCmJyk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb24gPSB0aGlzLnJvdXRlci5ldmVudHNcbiAgICAgIC5waXBlKFxuICAgICAgICBmaWx0ZXIoXG4gICAgICAgICAgKGV2ZW50OiB1bmtub3duKTogZXZlbnQgaXMgTmF2aWdhdGlvblN0YXJ0IHwgTmF2aWdhdGlvbkVuZCA9PlxuICAgICAgICAgICAgZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQgfHwgZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uRW5kLFxuICAgICAgICApLFxuICAgICAgICBtYXAoKGV2ZW50KSA9PiAoe1xuICAgICAgICAgIHRpbWVzdGFtcDogbmV3IERhdGUoKS5nZXRUaW1lKCksXG4gICAgICAgICAgZXZlbnQsXG4gICAgICAgIH0pKSxcbiAgICAgICAgcGFpcndpc2UoKSxcbiAgICAgICAgZmlsdGVyKChbYSwgYl0pID0+IGEuZXZlbnQgaW5zdGFuY2VvZiBOYXZpZ2F0aW9uU3RhcnQgJiYgYi5ldmVudCBpbnN0YW5jZW9mIE5hdmlnYXRpb25FbmQpLFxuICAgICAgKVxuICAgICAgLnN1YnNjcmliZSh7XG4gICAgICAgIG5leHQ6IChbc3RhcnQsIGVuZF0pID0+IHtcbiAgICAgICAgICBpZiAodGhpcy5kZWJ1Z1RyYWNpbmcpXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkKCdcXHgxQlsxbW5neC1NYXRvbW9cXHgxQlttIOKAoiDwn5qnIE5ldyBSb3V0ZSBjaGFuZ2Ugb2NjdXJyZW5jZScpO1xuICAgICAgICAgIGlmICh0aGlzLmRlYnVnVHJhY2luZylcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1xceDFCWzFtbmd4LU1hdG9tb1xceDFCW20g4oCiIPCflI4gRm91bmQgTmF2aWdhdGlvblN0YXJ0IGV2ZW50Jywgc3RhcnQuZXZlbnQpO1xuICAgICAgICAgIGlmICh0aGlzLmRlYnVnVHJhY2luZylcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1xceDFCWzFtbmd4LU1hdG9tb1xceDFCW20g4oCiIPCflI4gRm91bmQgTmF2aWdhdGlvbkVuZCBldmVudCcsIGVuZC5ldmVudCk7XG4gICAgICAgICAgY29uc3QgbG9jYXRpb25VcmwgPSBuZXcgVVJMKHRoaXMuZG9jdW1lbnQubG9jYXRpb24uaHJlZik7XG5cbiAgICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSBzaWduaWZpY2FudCBwYXJ0IG9mIHRoZSBsb2NhdGlvbiBoYXMgY2hhbmdlZCBiZWZvcmUgdHJhY2tpbmcgYW55dGhpbmdcbiAgICAgICAgICBjb25zdCBjdXJyZW50Um91dGVLZXkgPSB0aGlzLnJvdXRlVHJhY2tpbmdDb25maWd1cmF0aW9uLmNsZWFyTWF0cml4UGFyYW1zXG4gICAgICAgICAgICA/IGxvY2F0aW9uVXJsLmhyZWYucmVwbGFjZSgvO1tcXHcsJV0rPVtcXHcsJV0rL2csICcnKVxuICAgICAgICAgICAgOiBsb2NhdGlvblVybC5ocmVmICsgdGhpcy5yb3V0ZVRyYWNraW5nQ29uZmlndXJhdGlvbi5jbGVhclF1ZXJ5UGFyYW1zXG4gICAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgICAgOiBsb2NhdGlvblVybC5zZWFyY2ggKyB0aGlzLnJvdXRlVHJhY2tpbmdDb25maWd1cmF0aW9uLmNsZWFySGFzaFxuICAgICAgICAgICAgICAgID8gJydcbiAgICAgICAgICAgICAgICA6IGxvY2F0aW9uVXJsLmhhc2g7XG4gICAgICAgICAgaWYgKGN1cnJlbnRSb3V0ZUtleSA9PT0gdGhpcy5wcmV2aW91c1JvdXRlS2V5KSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIHRoaXMucHJldmlvdXNSb3V0ZUtleSA9IGN1cnJlbnRSb3V0ZUtleTtcblxuICAgICAgICAgIGlmICh0aGlzLmRlYnVnVHJhY2luZylcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1xceDFCWzFtbmd4LU1hdG9tb1xceDFCW20g4oCiIPCflI4gQWN0aXZhdGVkIHJvdXRlJywgdGhpcy5hY3RpdmF0ZWRSb3V0ZSk7XG4gICAgICAgICAgbGV0IGN1cnJlbnRSb3V0ZSA9IHRoaXMuYWN0aXZhdGVkUm91dGUuc25hcHNob3Qucm9vdDtcbiAgICAgICAgICB3aGlsZSAoY3VycmVudFJvdXRlLmZpcnN0Q2hpbGQpIHtcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLmRlYnVnVHJhY2luZylcbiAgICAgICAgICAgIC8vICAgY29uc29sZS5kZWJ1ZygnXFx4MUJbMW1uZ3gtTWF0b21vXFx4MUJbbSDigKIg8J+UjiBDYW5kaWRhdGUgcm91dGUgc25hcHNob3QnLCBjdXJyZW50Um91dGUpO1xuICAgICAgICAgICAgY3VycmVudFJvdXRlID0gY3VycmVudFJvdXRlLmZpcnN0Q2hpbGQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmRlYnVnVHJhY2luZylcbiAgICAgICAgICAgIGNvbnNvbGUuZGVidWcoJ1xceDFCWzFtbmd4LU1hdG9tb1xceDFCW20g4oCiIPCflI4gQ3VycmVudCByb3V0ZSBzbmFwc2hvdCcsIGN1cnJlbnRSb3V0ZSk7XG5cbiAgICAgICAgICAvLyBDaGVjayB0aGF0IHRoZSByb3V0ZSBpcyBub3QgbWFya2VkIGFzIG5vdCB0byBiZSB0cmFja2VkXG4gICAgICAgICAgaWYgKGN1cnJlbnRSb3V0ZS5kYXRhWydtYXRvbW8nXT8udHJhY2tpbmcgPT09ICdPRkYnKSByZXR1cm47XG5cbiAgICAgICAgICAvLyBTZXQgcmVmZXJyZXIgaWYgYXBwcm9wcmlhdGVcbiAgICAgICAgICBpZiAoc3RhcnQuZXZlbnQuaWQgPT09IDEpIHRoaXMubWF0b21vVHJhY2tlci5zZXRSZWZlcnJlclVybCh0aGlzLmRvY3VtZW50LnJlZmVycmVyKTtcblxuICAgICAgICAgIC8vIFNldCBjdXN0b20gVVJMIGZvciB0cmFja2luZ1xuICAgICAgICAgIGNvbnN0IGN1c3RvbVVybCA9XG4gICAgICAgICAgICAodGhpcy5yb3V0ZVRyYWNraW5nQ29uZmlndXJhdGlvbi5jbGVhck1hdHJpeFBhcmFtc1xuICAgICAgICAgICAgICA/IGxvY2F0aW9uVXJsLmhyZWYucmVwbGFjZSgvO1tcXHcsJV0rPVtcXHcsJV0rL2csICcnKVxuICAgICAgICAgICAgICA6IGxvY2F0aW9uVXJsLmhyZWYpICtcbiAgICAgICAgICAgICh0aGlzLnJvdXRlVHJhY2tpbmdDb25maWd1cmF0aW9uLmNsZWFyUXVlcnlQYXJhbXMgPyAnJyA6IGxvY2F0aW9uVXJsLnNlYXJjaCkgK1xuICAgICAgICAgICAgKHRoaXMucm91dGVUcmFja2luZ0NvbmZpZ3VyYXRpb24uY2xlYXJIYXNoID8gJycgOiBsb2NhdGlvblVybC5oYXNoKTtcbiAgICAgICAgICB0aGlzLm1hdG9tb1RyYWNrZXIuc2V0Q3VzdG9tVXJsKFxuICAgICAgICAgICAgdGhpcy5yb3V0ZVRyYWNraW5nQ29uZmlndXJhdGlvbi5jbGVhcklkc1xuICAgICAgICAgICAgICA/IGN1c3RvbVVybC5yZXBsYWNlKFxuICAgICAgICAgICAgICAgICAgY3VycmVudFJvdXRlLmRhdGFbJ21hdG9tbyddPy5pZFJlZ0V4cCBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICAgICAgICAgICAgICA/IGN1cnJlbnRSb3V0ZS5kYXRhWydtYXRvbW8nXT8uaWRSZWdFeHBcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnJvdXRlVHJhY2tpbmdDb25maWd1cmF0aW9uPy5pZFJlZ0V4cCBpbnN0YW5jZW9mIFJlZ0V4cFxuICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5yb3V0ZVRyYWNraW5nQ29uZmlndXJhdGlvbj8uaWRSZWdFeHBcbiAgICAgICAgICAgICAgICAgICAgICA6IERlZmF1bHRJZFJlZ0V4cCxcbiAgICAgICAgICAgICAgICAgIHRoaXMucm91dGVUcmFja2luZ0NvbmZpZ3VyYXRpb24uaWRSZXBsYWNlbWVudCEsXG4gICAgICAgICAgICAgICAgKVxuICAgICAgICAgICAgICA6IGN1c3RvbVVybCxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gUmVtb3ZlIGFsbCBwcmV2aW91c2x5IGFzc2lnbmVkIGN1c3RvbSB2YXJpYWJsZXNcbiAgICAgICAgICB0aGlzLm1hdG9tb1RyYWNrZXIuZGVsZXRlQ3VzdG9tVmFyaWFibGVzKCdwYWdlJyk7XG5cbiAgICAgICAgICAvLyBUcmFjayBwYWdlIHBlcmZvcm1hbmNlIHRpbWluZ1xuICAgICAgICAgIC8vIFRPRE86IEltcHJvdmUgcGVyZm9ybWFuY2UgdHJhY2tpbmdcbiAgICAgICAgICB0aGlzLm1hdG9tb1RyYWNrZXIuc2V0UGFnZVBlcmZvcm1hbmNlVGltaW5nKFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgdW5kZWZpbmVkLFxuICAgICAgICAgICAgZW5kLnRpbWVzdGFtcCAtIHN0YXJ0LnRpbWVzdGFtcCxcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcbiAgICAgICAgICApO1xuXG4gICAgICAgICAgLy8gVHJhY2sgcGFnZSB2aWV3XG5cbiAgICAgICAgICBpZiAoY3VycmVudFJvdXRlLmRhdGFbJ21hdG9tbyddPy50aXRsZSlcbiAgICAgICAgICAgIHRoaXMubWF0b21vVHJhY2tlci50cmFja1BhZ2VWaWV3KGN1cnJlbnRSb3V0ZS5kYXRhWydtYXRvbW8nXT8udGl0bGUpO1xuICAgICAgICAgIGVsc2UgdGhpcy5tYXRvbW9UcmFja2VyLnRyYWNrUGFnZVZpZXcoKTtcblxuICAgICAgICAgIGlmICh0aGlzLnJvdXRlVHJhY2tpbmdDb25maWd1cmF0aW9uLmxpbmtUcmFja2luZyAhPT0gJ05PTkUnKVxuICAgICAgICAgICAgdGhpcy5tYXRvbW9UcmFja2VyLmVuYWJsZUxpbmtUcmFja2luZyhcbiAgICAgICAgICAgICAgdGhpcy5yb3V0ZVRyYWNraW5nQ29uZmlndXJhdGlvbi5saW5rVHJhY2tpbmcgPT09ICdMRUZUX0NMSUNLX09OTFknID8gZmFsc2UgOiB0cnVlLFxuICAgICAgICAgICAgKTtcblxuICAgICAgICAgIGlmICh0aGlzLmRlYnVnVHJhY2luZykgY29uc29sZS5ncm91cEVuZCgpO1xuICAgICAgICB9LFxuICAgICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogU3RvcHMgdHJhY2tpbmcgcm91dGUgY2hhbmdlcy5cbiAgICovXG4gIHN0b3BUcmFja2luZygpOiB2b2lkIHtcbiAgICBpZiAodGhpcy5zdWJzY3JpcHRpb24pIHtcbiAgICAgIHRoaXMuc3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XG4gICAgICB0aGlzLnN1YnNjcmlwdGlvbiA9IHVuZGVmaW5lZDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQW5ndWxhciBPbkRlc3Ryb3kgbGlmZWN5Y2xlIGhvb2suXG4gICAqL1xuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcbiAgICB0aGlzLnN0b3BUcmFja2luZygpO1xuICB9XG59XG4iXX0=