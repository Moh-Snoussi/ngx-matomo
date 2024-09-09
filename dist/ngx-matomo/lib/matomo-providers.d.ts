import { Provider } from '@angular/core';
import { MatomoFeature } from './matomo-features';
declare global {
    /**
     * Extend Window interface in order to introduce the Matomo _paq attribute
     */
    interface Window {
        _paq: {
            push: (args: unknown[]) => void;
        };
    }
}
/**
 * Prepares Matomo tracking by returning a list of providers.
 *
 * @param {...*} features List of features to include in order to provide the correct list of providers.
 * @returns providers required for Matomo tracking.
 */
export declare function provideMatomoTracking(...features: MatomoFeature[]): Provider[];
