import { OnDestroy } from '@angular/core';
import * as i0 from "@angular/core";
/**
 * Service for tracking route changes.
 *
 * @export
 */
export declare class MatomoRouteTracker implements OnDestroy {
    private previousRouteKey;
    private readonly routeTrackingConfiguration;
    private readonly debugTracing;
    private readonly matomoTracker;
    private readonly router;
    private readonly activatedRoute;
    private readonly titleService;
    private readonly document;
    private subscription?;
    /**
     * Starts tracking route changes.
     * Matomo DocumentTitle will be set with the `title` or `data.matomo.title` of your routes.
     *
     * This service shall not be used directly within an application.
     */
    startTracking(): void;
    /**
     * Stops tracking route changes.
     */
    stopTracking(): void;
    /**
     * Angular OnDestroy lifecycle hook.
     */
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MatomoRouteTracker, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MatomoRouteTracker>;
}
