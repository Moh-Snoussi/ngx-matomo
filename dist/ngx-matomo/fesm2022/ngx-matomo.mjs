import * as i0 from '@angular/core';
import { InjectionToken, inject, Injectable, ENVIRONMENT_INITIALIZER, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationStart, NavigationEnd } from '@angular/router';
import { filter, map, pairwise } from 'rxjs/operators';

const defaultTrackers = Promise.resolve({
    trackers: [],
});
const defaultTrackingConfiguration = {
    disableCrossDomainLinking: false,
    disableCookies: false,
    doNotUserSendBeacon: false,
    enableDoNotTrack: false,
    consentRequirement: 'NONE',
    detectBrowserFeatures: false,
    trackJavaScriptErrors: false,
    disableCampaignParametersTracking: false,
};
const defaultRouteTrackingConfiguration = {
    linkTracking: 'NONE',
    clearIds: false,
    idReplacement: ':id',
    clearMatrixParams: false,
    clearQueryParams: false,
    clearHash: false,
};
/**
 * Injection token for internal Matomo trackers.
 */
const MATOMO_TRACKERS_INTERNAL_CONFIGURATION = new InjectionToken('Matomo trackers internal configuration');
/**
 * Injection token for internal Matomo tracking configuration.
 */
const MATOMO_TRACKING_INTERNAL_CONFIGURATION = new InjectionToken('Matomo tracking internal configuration');
/**
 * Injection token for internal Matomo route tracking configuration.
 */
const MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION = new InjectionToken('Matomo route tracking internal configuration');
/**
 * Injection token for Matomo debug tracing.
 */
const MATOMO_DEBUG_TRACING = new InjectionToken('Matomo debug tracing');

/* eslint-disable @typescript-eslint/ban-types */
const MATOMO_TRACKER_SET_FUNCTION = new InjectionToken('Matomo tracker set function');
function setFunctionFactory(dummyMode = false, debugTracing = false) {
    return !dummyMode
        ? function (method, ...args) {
            if (debugTracing)
                console.debug(`\x1B[1mngx-Matomo\x1B[m • 🚀 Call tracker Set method \x1B[4m${method}\x1B[m with`, args);
            try {
                window['_paq'].push([method, ...args]);
            }
            catch (e) {
                if (!(e instanceof ReferenceError))
                    throw e;
            }
        }
        : function (method, ...args) {
            if (debugTracing)
                console.debug(`\x1B[1mngx-Matomo\x1B[m • 🚀 Call dummy tracker Set method \x1B[4m${method}\x1B[m with`, args);
        };
}
const MATOMO_TRACKER_GET_FUNCTION = new InjectionToken('Matomo tracker get function');
function getFunctionFactory(dummyMode = false, debugTracing = false) {
    return !dummyMode
        ? function (method, ...args) {
            if (debugTracing)
                console.debug(`\x1B[1mngx-Matomo\x1B[m • 🚀 Call tracker Get method \x1B[4m${method}\x1B[m with`, args);
            return new Promise((resolve, reject) => {
                try {
                    window['_paq'].push([
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        function () {
                            resolve(this[method](args));
                        },
                    ]);
                }
                catch (e) {
                    if (!(e instanceof ReferenceError))
                        reject(e);
                }
            });
        }
        : function (method, ...args) {
            if (debugTracing)
                console.debug(`\x1B[1mngx-Matomo\x1B[m • 🚀 Call dummy tracker Get method \x1B[4m${method}\x1B[m with`, args);
            return Promise.resolve();
        };
}
const MATOMO_TRACKER_INVOKE_FUNCTION = new InjectionToken('Matomo tracker invoke function');
function invokeFunctionFactory(dummyMode = false, debugTracing = false) {
    return !dummyMode
        ? function (method, callback) {
            if (debugTracing)
                console.debug(`\x1B[1mngx-Matomo\x1B[m • 🚀 Call tracker Invoke method \x1B[4m${method}\x1B[m with`, callback);
            try {
                window['_paq'].push([method, callback]);
            }
            catch (e) {
                if (!(e instanceof ReferenceError))
                    throw e;
            }
        }
        : function (method, callback) {
            if (debugTracing)
                console.debug(`\x1B[1mngx-Matomo\x1B[m • 🚀 Call dummy tracker Invoke method \x1B[4m${method}\x1B[m with`, callback);
        };
}

/**
 * Wrapper for functions available in the Matomo Javascript tracker.
 *
 * @export
 */
class MatomoTracker {
    constructor() {
        this.setFunction = inject(MATOMO_TRACKER_SET_FUNCTION);
        this.getFunction = inject(MATOMO_TRACKER_GET_FUNCTION);
        this.invokeFunction = inject(MATOMO_TRACKER_INVOKE_FUNCTION);
        try {
            if (typeof window['_paq'] === 'undefined') {
                console.warn('Matomo has not yet been initialized!');
            }
        }
        catch (e) {
            if (!(e instanceof ReferenceError))
                throw e;
        }
    }
    /**
     * Logs a visit to this page.
     *
     * @param [customTitle] Optional title of the visited page.
     */
    trackPageView(customTitle) {
        const args = [];
        if (customTitle) {
            args.push(customTitle);
        }
        this.setFunction('trackPageView', args);
    }
    /**
     * Logs an event with an event category (Videos, Music, Games…), an event action (Play, Pause, Duration,
     * Add Playlist, Downloaded, Clicked…), and an optional event name and optional numeric value.
     *
     * @param category Category of the event.
     * @param action Action of the event.
     * @param [name] Optional name of the event.
     * @param [value] Optional value for the event.
     */
    trackEvent(category, action, name, value) {
        const args = [category, action];
        if (name) {
            args.push(name);
            if (typeof value === 'number') {
                args.push(value);
            }
        }
        this.setFunction('trackEvent', ...args);
    }
    /**
     * Logs an internal site search for a specific keyword, in an optional category,
     * specifying the optional count of search results in the page.
     *
     * @param keyword Keywords of the search query.
     * @param [category] Optional category of the search query.
     * @param [resultsCount] Optional number of results returned by the search query.
     */
    trackSiteSearch(keyword, category, resultsCount) {
        const args = [keyword];
        if (category) {
            args.push(category);
            if (typeof resultsCount === 'number') {
                args.push(resultsCount);
            }
        }
        this.setFunction('trackSiteSearch', ...args);
    }
    /**
     * Manually logs a conversion for the numeric goal ID, with an optional numeric custom revenue customRevenue.
     *
     * @param idGoal numeric ID of the goal to log a conversion for.
     * @param [customRevenue] Optional custom revenue to log for the goal.
     */
    trackGoal(idGoal, customRevenue) {
        const args = [idGoal];
        if (typeof customRevenue === 'number') {
            args.push(customRevenue);
            this.setFunction('trackGoal', ...args);
        }
    }
    /**
     * Manually logs a click from your own code.
     *
     * @param url Full URL which is to be tracked as a click.
     * @param linkType Either 'link' for an outlink or 'download' for a download.
     */
    trackLink(url, linkType) {
        this.setFunction('trackLink', url, linkType);
    }
    /**
     * Scans the entire DOM for all content blocks and tracks all impressions once the DOM ready event has been triggered.
     *
     * @see {@link https://developer.matomo.org/guides/content-tracking|Content Tracking}
     */
    trackAllContentImpressions() {
        this.setFunction('trackAllContentImpressions');
    }
    /**
     * Scans the entire DOM for all content blocks as soon as the page is loaded.<br />
     * It tracks an impression only if a content block is actually visible.
     *
     * @param checkOnScroll If true, checks for new content blocks while scrolling the page.
     * @param timeInterval Duration, in milliseconds, between two checks upon scroll.
     * @see {@link https://developer.matomo.org/guides/content-tracking|Content Tracking}
     */
    trackVisibleContentImpressions(checkOnScroll, timeInterval) {
        this.setFunction('trackVisibleContentImpressions', checkOnScroll, timeInterval);
    }
    /**
     * Scans the given DOM node and its children for content blocks and tracks an impression for them
     * if no impression was already tracked for it.
     *
     * @param node DOM node in which to look for content blocks which have not been previously tracked.
     * @see {@link https://developer.matomo.org/guides/content-tracking|Content Tracking}
     */
    trackContentImpressionsWithinNode(node) {
        this.setFunction('trackContentImpressionsWithinNode', node);
    }
    /**
     * Tracks an interaction with the given DOM node/content block.
     *
     * @param node DOM node for which to track a content interaction.
     * @param contentInteraction Name of the content interaction.
     * @see {@link https://developer.matomo.org/guides/content-tracking|Content Tracking}
     */
    trackContentInteractionNode(node, contentInteraction) {
        this.setFunction('trackContentInteractionNode', node, contentInteraction);
    }
    /**
     * Tracks a content impression using the specified values.
     *
     * @param contentName Content name.
     * @param contentPiece Content piece.
     * @param contentTarget Content target.
     * @see {@link https://developer.matomo.org/guides/content-tracking|Content Tracking}
     */
    trackContentImpression(contentName, contentPiece, contentTarget) {
        this.setFunction('trackContentImpression', contentName, contentPiece, contentTarget);
    }
    /**
     * Tracks a content interaction using the specified values.
     *
     * @param contentInteraction Content interaction.
     * @param contentName Content name.
     * @param contentPiece Content piece.
     * @param contentTarget Content target.
     * @see {@link https://developer.matomo.org/guides/content-tracking|Content Tracking}
     */
    trackContentInteraction(contentInteraction, contentName, contentPiece, contentTarget) {
        this.setFunction('trackContentInteraction', contentInteraction, contentName, contentPiece, contentTarget);
    }
    /**
     * Logs all found content blocks within a page to the console.<br />
     * This is useful to debug / test content tracking.
     */
    logAllContentBlocksOnPage() {
        this.setFunction('logAllContentBlocksOnPage');
    }
    /**
     * Sends a ping request.<br />
     * Ping requests do not track new actions.
     * If they are sent within the standard visit length, they will extend the existing visit and the current last action for the visit.
     * If sent after the standard visit length, ping requests will create a new visit using the last action in the last known visit.<br />
     * See also enableHeartBeatTimer.
     */
    ping() {
        this.setFunction('ping');
    }
    /**
     * Installs a Heart beat timer that will send additional requests to Matomo in order to better measure the time spent in the visit.
     * These requests will be sent only when the user is actively viewing the page (when the tab is active and in focus).
     * These requests will not track additional actions or pageviews.<br />
     * By default, activeTimeInSeconds is set to 15 seconds. Meaning only if the page was viewed for at least 15 seconds (and the user
     * leaves the page or focuses away from the tab) then a ping request will be sent.
     * @param activeTimeInseconds Delay, in seconds, between two heart beats to the server.
     * @see {@link ping}
     * @see {@link https://developer.matomo.org/guides/tracking-javascript-guide#accurately-measure-the-time-spent-on-each-page}
     */
    enableHeartBeatTimer(activeTimeInseconds) {
        const args = [];
        if (activeTimeInseconds) {
            args.push(activeTimeInseconds);
        }
        this.setFunction('enableHeartBeatTimer', ...args);
    }
    /**
     * Records how long the page has been viewed if the minimumVisitLength is attained;
     * the heartBeatDelay determines how frequently to update the server.
     *
     * @param minimumVisitLength Duration before notifying the server for the duration of the visit to a page.
     * @param heartBeatDelay Delay, in seconds, between two updates to the server.
     * @see {@link https://developer.matomo.org/guides/tracking-javascript-guide#accurately-measure-the-time-spent-on-each-page}
     */
    setHeartBeatTimer(minimumVisitLength, heartBeatDelay) {
        this.setFunction('setHeartBeatTimer', minimumVisitLength, heartBeatDelay);
    }
    /**
     * Installs link tracking on all applicable link elements.
     *
     * @param [enable=false] Set to true to use pseudo click-handler (treat middle click and open contextmenu as left click).<br />
     * A right click (or any click that opens the context menu) on a link will be tracked as clicked even if "Open in new tab" is
     * not selected.<br />
     * If false (default), nothing will be tracked on open context menu or middle click.
     */
    enableLinkTracking(enable = false) {
        this.setFunction('enableLinkTracking', enable);
    }
    /**
     * Enables tracking of `file://` protocol actions.<br />
     * By default, the `file://` protocol is not tracked.
     */
    enableFileTracking() {
        this.setFunction('enableFileTracking');
    }
    /**
     * Disables page performance tracking.
     */
    disablePerformanceTracking() {
        this.setFunction('disablePerformanceTracking');
    }
    /**
     * Enables cross domain linking. By default, the visitor ID that identifies a unique visitor is stored in the browser's
     * first party cookies.<br />
     * This means the cookie can only be accessed by pages on the same domain.<br />
     * If you own multiple domains and would like to track all the actions and pageviews of a specific visitor into the same visit,
     * you may enable cross domain linking.<br />
     * Whenever a user clicks on a link it will append a URL parameter pk_vid to the clicked URL which forwards the current
     * visitor ID value to the page of the different domain.
     *
     * @see {@link https://matomo.org/faq/how-to/faq_23654/|Cross Domain Linking}
     */
    enableCrossDomainLinking() {
        this.setFunction('enableCrossDomainLinking');
    }
    /**
     * Sets the cross domain linking timeout.<br />
     * By default, the two visits across domains will be linked together when the link is clicked and the page is loaded within
     * a 180 seconds timeout window.
     *
     * @param timeout Timeout, in seconds, between two actions across two domains before creating a new visit.
     * @see {@link https://matomo.org/faq/how-to/faq_23654/|Cross Domain Linking}
     */
    setCrossDomainLinkingTimeout(timeout) {
        this.setFunction('setCrossDomainLinkingTimeout', timeout);
    }
    /**
     * Returns the query parameter to append to links to handle cross domain linking.<br />
     * Use this to add cross domain support for links that are added to the DOM dynamically.
     *
     * @returns Promise object representing the `pk_vid` query parameter.
     * @see {@link https://matomo.org/faq/how-to/faq_23654/|Cross Domain Linking}
     */
    getCrossDomainLinkingUrlParameter() {
        return this.getFunction('getCrossDomainLinkingUrlParameter');
    }
    /**
     * Prevents campaign parameters from being sent to the tracker.<br />
     * By default, Matomo will send campaign parameters (mtm, utm, etc.) to the tracker and record that information.
     * Some privacy regulations may not allow for this information to be collected.<br />
     * This method is available as of Matomo 5.1.
     */
    disableCampaignParameters() {
        this.setFunction('disableCampaignParameters');
    }
    /**
     * Overrides document.title
     *
     * @param title Title of the document.
     */
    setDocumentTitle(title) {
        this.setFunction('setDocumentTitle', title);
    }
    /**
     * Sets array of hostnames or domains to be treated as local.<br />
     * For wildcard subdomains, you can use: `setDomains('.example.com')`; or `setDomains('*.example.com');`.<br />
     * You can also specify a path along a domain: `setDomains('*.example.com/subsite1');`.
     *
     * @param domains List of hostnames or domains, with or without path, to be treated as local.
     * @see {@link https://matomo.org/faq/how-to/faq_23654/|Cross Domain Linking}
     */
    setDomains(domains) {
        this.setFunction('setDomains', domains);
    }
    /**
     * Overrides the page's reported URL.
     *
     * @param url URL to be reported for the page.
     */
    setCustomUrl(url) {
        this.setFunction('setCustomUrl', url);
    }
    /**
     * Overrides the detected Http-Referer.
     * Matomo recommends you call this method early in your tracking code before you call `trackPageView` if it should be applied to all tracking requests.
     *
     * @param url URL to be reported for the referrer.
     */
    setReferrerUrl(url) {
        this.setFunction('setReferrerUrl', url);
    }
    /**
     * Sets the array of hostnames or domains that should be ignored as referrers.
     * For wildcard subdomains, you can use: `'.example.com'` or `'*.example.com'`. You can also specify a path along a domain: setExcludedReferrers('*.example.com/subsite1');.
     * This method is available as of Matomo 4.12.
     * @param url URL or list of URL
     */
    setExcludedReferrers(url) {
        this.setFunction('setExcludedReferrers', url);
    }
    /**
     * Returns the list of excluded referrers, which was previously set using `setExcludedReferrers`.
     *
     * @returns Promise objects represents the list of excluded referrers.
     */
    getExcludedReferrers() {
        return this.getFunction('getExcludedReferrers');
    }
    /**
     * Specifies the website ID.<br />
     * Redundant: can be specified in getTracker() constructor.
     *
     * TODO Investigate if setSiteId needs to be removed from MatomoTracker.
     * @param siteId Site ID for the tracker.
     */
    setSiteId(siteId) {
        this.setFunction('setSiteId', siteId);
    }
    /**
     * Specifies the Matomo HTTP API URL endpoint.<br />
     * Points to the root directory of Matomo, e.g. http://matomo.example.org/ or https://example.org/matomo/.<br />
     * This function is only useful when the 'Overlay' report is not working.<br />
     * By default, you do not need to use this function.
     *
     * @param url URL for Matomo HTTP API endpoint.
     */
    setApiUrl(url) {
        this.setFunction('setApiUrl', url);
    }
    /**
     * Specifies the Matomo server URL.<br />
     * Redundant: can be specified in getTracker() constructor.
     *
     * TODO Investigate if setTrackerUrl needs to be removed from MatomoTracker.
     * @param url URL for the Matomo server.
     */
    setTrackerUrl(url) {
        this.setFunction('setTrackerUrl', url);
    }
    /**
     * Returns the Matomo server URL.
     *
     * @returns Promise object representing the Matomo server URL.
     */
    getMatomoUrl() {
        return this.getFunction('getMatomoUrl');
    }
    /**
     * Returns the current url of the page that is currently being visited.<br />
     * If a custom URL was set before calling this method, the custom URL will be returned.
     *
     * @returns Promise object representing the URL of the current page.
     */
    getCurrentUrl() {
        return this.getFunction('getCurrentUrl');
    }
    /**
     * Disables the browser feature detection.<br />
     * By default, Matomo accesses information from the visitor's browser to detect the current browser resolution and what browser plugins
     * (for example PDF and cookies) are supported. This information is used to show you reports on your visitor's browser resolution, supported
     * browser plugins, and it is also used to generate a short-lived identifier for every visitor which we call the config_id.<br />
     * Some privacy regulations may only allow accessing information from a visitor's device after having consent. If this applies to you, call
     * this method to no longer access this information.
     *
     * @see {@link https://matomo.org/faq/how-do-i-disable-browser-feature-detection-completely/|How do I disable browser feature detection completely?}
     */
    disableBrowserFeatureDetection() {
        this.setFunction('disableBrowserFeatureDetection');
    }
    /**
     * Enables the browser feature detection if you previously disabled it.
     */
    enableBrowserFeatureDetection() {
        this.setFunction('enableBrowserFeatureDetection');
    }
    /**
     * Sets classes to be treated as downloads (in addition to piwik_download).
     *
     * @param classes Class, or list of classes to be treated as downloads.
     */
    setDownloadClasses(classes) {
        this.setFunction('setDownloadClasses', classes);
    }
    /**
     * Sets file extensions to be recognized as downloads.<br />
     * Example: `'docx'` or `['docx', 'xlsx']`.
     *
     * @param extensions Extension, or list of extensions to be recognized as downloads.
     */
    setDownloadExtensions(extensions) {
        this.setFunction('setDownloadClasses', extensions);
    }
    /**
     * Sets additional file extensions to be recognized as downloads.<br />
     * Example: `'docx'` or `['docx', 'xlsx']`.
     *
     * @param extensions Extension, or list of extensions to be recognized as downloads.
     */
    addDownloadExtensions(extensions) {
        this.setFunction('setDownloadClasses', extensions);
    }
    /**
     * Specifies file extensions to be removed from the list of download file extensions.<br />
     * Example: `'docx'` or `['docx', 'xlsx']`.
     *
     * @param extensions Extension, or list of extensions not to be recognized as downloads.
     */
    removeDownloadExtensions(extensions) {
        this.setFunction('setDownloadClasses', extensions);
    }
    /**
     * Sets classes to be ignored if present in link (in addition to piwik_ignore).
     *
     * @param classes Class, or list of classes to be ignored if present in link.
     */
    setIgnoreClasses(classes) {
        this.setFunction('setDownloadClasses', classes);
    }
    /**
     * Sets classes to be treated as outlinks (in addition to piwik_link).
     *
     * @param classes Class, or list of classes to be treated as outlinks.
     */
    setLinkClasses(classes) {
        this.setFunction('setDownloadClasses', classes);
    }
    /**
     * Sets delay for link tracking (in milliseconds).
     *
     * @param delay Delay, in milliseconds, for link tracking.
     */
    setLinkTrackingTimer(delay) {
        this.setFunction('setLinkTrackingTimer', delay);
    }
    /**
     * Returns delay for link tracking.
     *
     * @returns Promise object representing the delay in milliseconds.
     */
    getLinkTrackingTimer() {
        return this.getFunction('getLinkTrackingTimer');
    }
    /**
     * Sets if or not to record the hash tag (anchor) portion of URLs.
     *
     * @param value If true, the hash tag portion of the URLs won't be recorded.
     */
    discardHashTag(value) {
        this.setFunction('discardHashTag', value);
    }
    /**
     * By default Matomo uses the browser DOM Timing API to accurately determine the time it takes to generate and download
     * the page. You may overwrite this value with this function.
     * This API has been deprecated in Matomo 4.x.
     *
     * @param generationTime Time, in milliseconds, of the page generation.
     * @deprecated since version 3.0.
     * @see {@link setPagePerformanceTiming}
     */
    setGenerationTimeMs(generationTime) {
        this.setFunction('setGenerationTimeMs', generationTime);
    }
    /**
     * Appends a custom string to the end of the HTTP request to matomo.php.
     *
     * @param appendToUrl String to append to the end of the HTTP request to piwik.php/matomo.php.
     */
    appendToTrackingUrl(appendToUrl) {
        this.setFunction('appendToTrackingUrl', appendToUrl);
    }
    /**
     * Enables a frame-buster to prevent the tracked web page from being framed/iframed.
     */
    killFrame() {
        this.setFunction('killFrame');
    }
    /**
     * Forces the browser to load the live URL if the tracked web page is loaded from a local file
     * (e.g., saved to someone's desktop).
     *
     * @param url URL to track instead of `file://` URLs.
     */
    redirectFile(url) {
        this.setFunction('redirectFile', url);
    }
    /**
     * Returns the 16 characters ID for the visitor.
     *
     * @returns Promise object representing the 16 characters ID for the visitor.
     */
    getVisitorId() {
        return this.getFunction('getVisitorId');
    }
    /**
     * Sets the `visitorId`.<br />
     * The visitorId won't be persisted in a cookie and needs to be set on every new page load.
     *
     *  @param visitorId needs to be a 16 digit hex string.
     */
    setVisitorId(visitorId) {
        this.setFunction('setVisitorId', visitorId);
    }
    /**
     * Returns the visitor cookie contents in an array.
     *
     * @returns Promise object representing the cookie contents in an array.
     */
    getVisitorInfo() {
        return this.getFunction('getVisitorInfo');
    }
    /**
     * Returns the visitor attribution array (Referer information and/or Campaign name & keyword).<br />
     * Attribution information is used by Matomo to credit the correct referrer (first or last referrer)
     * used when a user triggers a goal conversion.
     *
     * @returns Promise object representing the visitor attribution array (Referer information and/or Campaign name & keyword).
     */
    getAttributionInfo() {
        return this.getFunction('getAttributionInfo');
    }
    /**
     * Returns the attribution campaign name.
     *
     * @returns Promise object representing the attribution campaign name.
     */
    getAttributionCampaignName() {
        return this.getFunction('getAttributionCampaignName');
    }
    /**
     * Returns the attribution campaign keyword.
     *
     * @returns Promise object representing the attribution campaign keyword.
     */
    getAttributionCampaignKeyword() {
        return this.getFunction('getAttributionCampaignKeyword');
    }
    /**
     * Returns the attribution referrer timestamp.
     *
     * @returns Promise object representing the attribution referrer timestamp (as string).
     */
    getAttributionReferrerTimestamp() {
        return this.getFunction('getAttributionReferrerTimestamp');
    }
    /**
     * Returns the attribution referrer URL.
     *
     * @returns Promise object representing the attribution referrer URL
     */
    getAttributionReferrerUrl() {
        return this.getFunction('getAttributionReferrerUrl');
    }
    /**
     * Returns the User ID string if it was set.
     *
     * @returns Promise object representing the User ID for the visitor.
     * @see {@link https://matomo.org/docs/user-id/|Matomo User ID}
     */
    getUserId() {
        return this.getFunction('getUserId');
    }
    /**
     * Sets a User ID to this user (such as an email address or a username).
     *
     * @param userId User ID to set for the current visitor.
     * @see {@link https://matomo.org/docs/user-id/|Matomo User ID}
     */
    setUserId(userId) {
        this.setFunction('setUserId', userId);
    }
    /**
     * Resets the User ID which also generates a new Visitor ID.
     *
     * @see {@link https://matomo.org/docs/user-id/|Matomo User ID}
     */
    resetUserId() {
        this.setFunction('resetUserId');
    }
    /**
     * Overrides PageView id for every use of logPageView().
     * Do not use this if you call trackPageView() multiple times during tracking (e.g. when tracking a single page application)
     *
     * @param pageViewId PageView id to use.
     */
    setPageViewId(pageViewId) {
        this.setFunction('setPageViewId', pageViewId);
    }
    /**
     * Returns the PageView id.
     * If not set manually using setPageViewId, this method will return the dynamic PageView id, used in the last tracked page view,
     * or undefined if no page view was tracked yet.
     *
     * @returns Promise object representing the PageView id.
     */
    getPageViewId() {
        return this.getFunction('getPageViewId');
    }
    /**
     * Sets a custom variable.
     *
     * @param index Index, the number from 1 to 5 where this custom variable name is stored for the current page view.
     * @param name Name, the name of the variable, for example: Category, Sub-category, UserType.
     * @param value Value, for example: "Sports", "News", "World", "Business"…
     * @param scope Scope of the custom variable:<br />
     * - 'page' means the custom variable applies to the current page view.
     * - 'visit' means the custom variable applies to the current visitor.
     * - 'event' means the custom variable applies to the current event.
     * @see {@link https://matomo.org/docs/custom-variables/|Custom Variables}
     */
    setCustomVariable(index, name, value, scope) {
        this.setFunction('setCustomVariable', index, name, value, scope);
    }
    /**
     * Deletes a custom variable.
     *
     * @param index Index of the custom variable to delete.
     * @param scope Scope of the custom variable to delete.
     * @see {@link https://matomo.org/docs/custom-variables/|Custom Variables}
     */
    deleteCustomVariable(index, scope) {
        this.setFunction('deleteCustomVariable', index, scope);
    }
    /**
     * Deletes all custom variables.
     *
     * @param scope Scope of the custom variables to delete.
     * @see {@link https://matomo.org/docs/custom-variables/|Custom Variables}
     */
    deleteCustomVariables(scope) {
        this.setFunction('deleteCustomVariables', scope);
    }
    /**
     * Retrieves a custom variable.
     *
     * @param index Index of the custom variable to retrieve.
     * @param scope Scope of the custom variable to retrieve.
     * @returns Promise object representing the value of custom variable.
     * @see {@link https://matomo.org/docs/custom-variables/|Custom Variables}
     */
    getCustomVariable(index, scope) {
        return this.getFunction('getCustomVariable', index, scope);
    }
    /**
     * When called then the Custom Variables of scope 'visit' will be stored (persisted) in a first party cookie
     * for the duration of the visit.<br />
     * This is useful if you want to call `getCustomVariable` later in the visit.<br />
     * (by default custom variables are not stored on the visitor's computer.)
     *
     * @see {@link https://matomo.org/docs/custom-variables/|Custom Variables}
     */
    storeCustomVariablesInCookie() {
        this.setFunction('storeCustomVariablesInCookie');
    }
    /**
     * Sets a custom dimension.<br />
     * (requires Custom Dimensions plugin)
     *
     * @param customDimensionId ID of the custom dimension to set.
     * @param customDimensionValue Value to be set.
     * @see {@link https://plugins.piwik.org/CustomDimensions|Custom Dimensions}
     */
    setCustomDimension(customDimensionId, customDimensionValue) {
        this.setFunction('setCustomDimension', customDimensionId, customDimensionValue);
    }
    /**
     * Deletes a custom dimension.<br />
     * (requires Custom Dimensions plugin)
     *
     * @param customDimensionId ID of the custom dimension to delete.
     * @see {@link https://plugins.piwik.org/CustomDimensions|Custom Dimensions}
     */
    deleteCustomDimension(customDimensionId) {
        this.setFunction('deleteCustomDimension', customDimensionId);
    }
    /**
     * Retrieve a custom dimension.<br />
     * (requires Custom Dimensions plugin)
     *
     * @param customDimensionId ID of the custom dimension to retrieve.
     * @returns Promise object representing the value for the requested custom dimension.
     * @see {@link https://plugins.piwik.org/CustomDimensions|Custom Dimensions}
     */
    getCustomDimension(customDimensionId) {
        return this.getFunction('getCustomDimension', customDimensionId);
    }
    /**
     * Sets campaign name parameter(s).
     *
     * @param name Name of the campaign
     * @see {@link https://matomo.org/docs/tracking-campaigns/|Campaigns}
     */
    setCampaignNameKey(name) {
        this.setFunction('setCampaignNameKey', name);
    }
    /**
     * Sets campaign keyword parameter(s).
     *
     * @param keyword Keyword parameter(s) of the campaign.
     * @see {@link https://matomo.org/docs/tracking-campaigns/|Campaigns}
     */
    setCampaignKeywordKey(keyword) {
        this.setFunction('setCampaignKeywordKey', keyword);
    }
    /**
     * Sets if or not to attribute a conversion to the first referrer.<br />
     * By default, conversion is attributed to the most recent referrer.
     *
     * @param conversionToFirstReferrer If true, Matomo will attribute the Goal conversion to the first referrer used
     * instead of the last one.
     * @see {@link https://matomo.org/docs/tracking-campaigns/|Campaigns}
     * @see {@link https://matomo.org/faq/general/faq_106/#faq_106|Conversions to the first referrer}
     */
    setConversionAttributionFirstReferrer(conversionToFirstReferrer) {
        this.setFunction('setConversionAttributionFirstReferrer', conversionToFirstReferrer);
    }
    /**
     * Sets the current page view as a product or category page view.<br />
     * When you call setEcommerceView, it must be followed by a call to trackPageView to record the product or category page view.
     *
     * @param productSKU SKU of the viewed product.
     * @param productName Name of the viewed product.
     * @param productCategory Category of the viewed product.
     * @param price Price of the viewed product.
     */
    setEcommerceView(productSKU, productName, productCategory, price) {
        this.setFunction('setEcommerceView', productSKU, productName, productCategory, price);
    }
    /**
     * Adds a product into the eCommerce order.<br />
     * Must be called for each product in the order.
     *
     * @param productSKU SKU of the product to add.
     * @param [productName] Optional name of the product to add.
     * @param [productCategory] Optional category of the product to add.
     * @param [price] Optional price of the product to add.
     * @param [quantity] Optional quantity of the product to add.
     */
    addEcommerceItem(productSKU, productName, productCategory, price, quantity) {
        const args = [productSKU];
        if (productName) {
            args.push(productName);
            if (productCategory) {
                args.push(productCategory);
                if (typeof price === 'number') {
                    args.push(price);
                    if (typeof quantity === 'number') {
                        args.push(quantity);
                    }
                }
            }
        }
        this.setFunction('addEcommerceItem', ...args);
    }
    /**
     * Removes the specified product from the untracked ecommerce order.
     *
     * @param productSKU SKU of the product to remove.
     */
    removeEcommerceItem(productSKU) {
        this.setFunction('removeEcommerceItem', productSKU);
    }
    /**
     * Removes all products in the untracked ecommerce order.<br />
     * Note: this is done automatically after `trackEcommerceOrder()` is called.
     */
    clearEcommerceCart() {
        this.setFunction('clearEcommerceCart');
    }
    /**
     * Returns all ecommerce items currently in the untracked ecommerce order.
     * The returned array will be a copy, so changing it won't affect the ecommerce order.<br />
     * To affect what gets tracked, use the `addEcommerceItem()`/`removeEcommerceItem()`/`clearEcommerceCart()` methods.<br />
     * Use this method to see what will be tracked before you track an order or cart update.
     *
     * @returns Promise object representing the list of items in the current untracked order.
     */
    getEcommerceItems() {
        return this.getFunction('getEcommerceItems');
    }
    /**
     * Tracks a shopping cart.<br />
     * Call this function every time a user is adding, updating or deleting a product from the cart.
     *
     * @param grandTotal Grand total of the shopping cart.
     */
    trackEcommerceCartUpdate(grandTotal) {
        this.setFunction('trackEcommerceCartUpdate', grandTotal);
    }
    /**
     * Tracks an Ecommerce order, including any eCommerce item previously added to the order.<br />
     * orderId and grandTotal (ie.revenue) are required parameters.
     *
     * @param orderId ID of the tracked order.
     * @param grandTotal Grand total of the tracked order.
     * @param [subTotal] Sub total of the tracked order.
     * @param [tax] Taxes for the tracked order.
     * @param [shipping] Shipping fees for the tracked order.
     * @param [discount] Discount granted for the tracked order.
     */
    trackEcommerceOrder(orderId, grandTotal, subTotal, tax, shipping, discount) {
        const args = [orderId, grandTotal];
        if (typeof subTotal === 'number') {
            args.push(subTotal);
            if (typeof tax === 'number') {
                args.push(tax);
                if (typeof shipping === 'number') {
                    args.push(shipping);
                    if (typeof discount === 'number' || typeof discount === 'boolean') {
                        args.push(discount);
                    }
                }
            }
        }
        this.setFunction('trackEcommerceOrder', ...args);
    }
    /**
     * Returns true or false depending on whether requireConsent was called previously.
     *
     * @returns Promise object representing the current status for consent requirement.
     */
    isConsentRequired() {
        return this.getFunction('isConsentRequired');
    }
    /**
     * By default the Matomo tracker assumes consent to tracking.
     * To change this behavior so nothing is tracked until a user consents, you must call `requireConsent`.
     */
    requireConsent() {
        this.setFunction('requireConsent');
    }
    /**
     * Require user cookie consent before storing and using any cookies.
     */
    requireCookieConsent() {
        this.setFunction('requireCookieConsent');
    }
    /**
     * Marks that the current user has consented.<br />
     * The consent is one-time only, so in a subsequent browser session, the user will have to consent again.<br />
     * To remember consent, see the method below: `rememberConsentGiven`.
     *
     * @see {@link rememberConsentGiven}
     */
    setConsentGiven() {
        this.setFunction('setConsentGiven');
    }
    /**
     * Marks that the current user has consented to store and use cookies.<br />
     * The consent is one-time only, so in a subsequent browser session, the user will have to consent again.<br />
     * To remember consent, see the method below: `rememberCookieConsentGiven`.
     */
    setCookieConsentGiven() {
        this.setFunction('setCookieConsentGiven');
    }
    /**
     * Marks that the current user has consented, and remembers this consent through a browser cookie.<br />
     * The next time the user visits the site, Matomo will remember that they consented, and track them.<br />
     * If you call this method, you do not need to call `setConsentGiven`.
     *
     * @param hoursToExpire Expiry period for your user consent.
     */
    rememberConsentGiven(hoursToExpire) {
        const args = [];
        if (typeof hoursToExpire === 'number') {
            args.push(hoursToExpire);
        }
        this.setFunction('rememberConsentGiven', ...args);
    }
    /**
     * Marks that the current user has consented, and remembers this consent through a browser cookie.<br />
     * The next time the user visits the site, Matomo will remember that they consented, and track them.<br />
     * If you call this method, you do not need to call `setCookieConsentGiven`.
     *
     * @param hoursToExpire Expiry period for your user consent.
     */
    rememberCookieConsentGiven(hoursToExpire) {
        const args = [];
        if (typeof hoursToExpire === 'number') {
            args.push(hoursToExpire);
        }
        this.setFunction('rememberCookieConsentGiven', ...args);
    }
    /**
     * Removes a user's consent, both if the consent was one-time only and if the consent was remembered.<br />
     * This makes sure the cookie that remembered the given consent is deleted.<br />
     * After calling this method, the user will have to consent again in order to be tracked.
     */
    forgetConsentGiven() {
        this.setFunction('forgetConsentGiven');
    }
    /**
     * Removes a user's consent, both if the consent was one-time only and if the consent was remembered.<br />
     * This makes sure the cookie that remembered the given consent is deleted.<br />
     * After calling this method, the user will have to consent again in order to be tracked.
     */
    forgetCookieConsentGiven() {
        this.setFunction('forgetCookieConsentGiven');
    }
    /**
     * Returns true or false depending on whether the current visitor has given consent previously or not.
     *
     * @returns Promise object representing whether consent has been remembered or not.
     */
    hasRememberedConsent() {
        return this.getFunction('hasRememberedConsent');
    }
    /**
     * If consent was given, returns the timestamp when the visitor gave consent.<br />
     * Only works if `rememberConsentGiven` was used and not when `setConsentGiven` was used.
     * The timestamp is the local timestamp which depends on the visitors time.
     *
     * @return Promise object representing the timestamp when consent was remembered.
     */
    getRememberedConsent() {
        return this.getFunction('getRememberedConsent');
    }
    /**
     * If cookie consent was given, returns the timestamp when the visitor gave consent.<br />
     * Only works if `rememberCookieConsentGiven` was used and not when `setCookieConsentGiven` was used.
     * The timestamp is the local timestamp which depends on the visitors time.
     */
    getRememberedCookieConsent() {
        return this.getFunction('getRememberedCookieConsent');
    }
    /**
     * Sets if to not to track users who opt out of tracking using Mozilla's (proposed) Do Not Track setting.
     *
     * @param doNotTrack If true, users who opted for Do Not Track in their settings won't be tracked.
     * @see {@link https://www.w3.org/TR/tracking-dnt/}
     */
    setDoNotTrack(doNotTrack) {
        this.setFunction('setDoNotTrack', doNotTrack);
    }
    /**
     * After calling this function, the user will be opted out and no longer be tracked.
     */
    optUserOut() {
        this.setFunction('optUserOut');
    }
    /**
     * After calling this method the user will be tracked again. Call this method if the user opted out before.
     */
    forgetUserOptOut() {
        this.setFunction('forgetUserOptOut');
    }
    /**
     * Returns true or false depending on whether the user is opted out or not.<br />
     * Note: This method might not return the correct value if you are using the opt out iframe.
     *
     * @returns Promise object representing whether the user is opted out or not.
     */
    isUserOptedOut() {
        return this.getFunction('isUserOptedOut');
    }
    /**
     * Disables all first party cookies.<br />
     * Existing Matomo cookies for this websites will be deleted on the next page view.
     */
    disableCookies() {
        this.setFunction('disableCookies');
    }
    /**
     * Deletes the tracking cookies currently set (useful when creating new visits).
     */
    deleteCookies() {
        this.setFunction('deleteCookies');
    }
    /**
     * Returns whether cookies are enabled and supported by this browser.
     *
     * @returns Promise object representing the support and activation of cookies.
     */
    hasCookies() {
        return this.getFunction('hasCookies');
    }
    /**
     * Returns true or false depending on whether cookies are currently enabled or disabled.
     *
     * @returns Promise object representing whether cookies are enabled or not.
     */
    areCookiesEnabled() {
        return this.getFunction('areCookiesEnabled');
    }
    /**
     * Sets the tracking cookie name prefix.<br />
     * Default prefix is 'pk'.
     *
     * @param prefix Prefix for the tracking cookie names.
     */
    setCookieNamePrefix(prefix) {
        this.setFunction('setCookieNamePrefix', prefix);
    }
    /**
     * Sets the domain of the tracking cookies.<br />
     * Default is the document domain.<br />
     * If your website can be visited at both www.example.com and example.com, you would use: `'.example.com'` or `'*.example.com'`.
     *
     * @param domain Domain of the tracking cookies.
     */
    setCookieDomain(domain) {
        this.setFunction('setCookieDomain', domain);
    }
    /**
     * Sets the path of the tracking cookies.<br />
     * Default is '/'.
     *
     * @param path Path of the tracking cookies.
     */
    setCookiePath(path) {
        this.setFunction('setCookiePath', path);
    }
    /**
     * Sets if or not to enable the Secure cookie flag on all first party cookies.<br />
     * This should be used when your website is only available under HTTPS so that all tracking cookies are always sent
     * over secure connection.
     *
     * @param secure If true, the secure cookie flag will be set on all first party cookies.
     */
    setSecureCookie(secure) {
        this.setFunction('setSecureCookie', secure);
    }
    /**
     * defaults to `Lax`. Can be set to `None` or `Strict`.<br />
     * `None` requires all traffic to be on HTTPS and will also automatically set the secure cookie.
     * It can be useful for example if the tracked website is an iframe.<br />
     * `Strict` only works if your Matomo and the website runs on the very same domain.
     *
     * @param policy Either `Lax`, `Strict` or `None`
     * */
    setCookieSameSite(policy) {
        this.setFunction('setCookieSameSite', policy);
    }
    /**
     * Sets the visitor cookie timeout.<br />
     * Default is 13 months.
     *
     * @param timeout Timeout, in seconds, for the visitor cookie timeout.
     */
    setVisitorCookieTimeout(timeout) {
        this.setFunction('setVisitorCookieTimeout', timeout);
    }
    /**
     * Sets the referral cookie timeout.<br />
     * Default is 6 months.
     *
     * @param timeout Timeout, in seconds, for the referral cookie timeout.
     */
    setReferralCookieTimeout(timeout) {
        this.setFunction('setReferralCookieTimeout', timeout);
    }
    /**
     * Sets the session cookie timeout.<br />
     * Default is 30 minutes.
     *
     * @param timeout Timeout, in seconds, for the session cookie timeout.
     */
    setSessionCookieTimeout(timeout) {
        this.setFunction('setSessionCookieTimeout', timeout);
    }
    /**
     * Adds a click listener to a specific link element.<br />
     * When clicked, Matomo will log the click automatically.
     *
     * @param element Element on which to add a click listener.
     */
    addListener(element) {
        this.setFunction('addListener', element);
    }
    /**
     * Sets the request method to either `GET` or `POST`. (The default is `GET`.)<br />
     * To use the `POST` request method, either:<br />
     * 1) the Matomo host is the same as the tracked website host (Matomo installed in the same domain as your tracked website), or<br />
     * 2) if Matomo is not installed on the same host as your website, you need to enable CORS (Cross domain requests).<br />
     * Keep in mind that when Matomo uses sendBeacon() for sending tracking requests (which is enabled by default) it will send data via `POST`.
     * If you want Matomo to never send `POST` requests, you can use this method to force `GET` which will automatically disable `sendBeacon`.
     *
     * @param method HTTP method for sending information to the Matomo server.
     * @see {@link https://matomo.org/faq/how-to/faq_18694/|enable CORS (Cross domain requests)}
     */
    setRequestMethod(method) {
        this.setFunction('setRequestMethod', method);
    }
    /**
     * Enables the use of `navigator.sendBeacon()`
     * Why would I use this feature? When enabling this feature, likely more of your clicks on downloads/outlinks will be tracked
     * and reported in Matomo (more accuracy). Also it will reduce the link tracking time to a minimum of 100ms instead of
     * the default 500ms (default which can be increased), so that when they click on an outlink then the navigation to this
     * clicked page will happen 400ms faster (faster and better user experience).
     * Send beacon will only be used if the browser actually supports it.<br />
     * Some ad blockers or other browser extensions may block the `sendBeacon` feature which could again cause limited data
     * loss in these cases.<br />
     * Note: use of `sendBeacon` has been be enabled by default since Matomo 4.
     */
    enableAlwaysUseSendBeacon() {
        this.setFunction('alwaysUseSendBeacon');
    }
    /**
     * Disables sending tracking tracking requests using `navigator.sendBeacon` which is enabled by default.
     */
    disableAlwaysUseSendBeacon() {
        this.setFunction('disableAlwaysUseSendBeacon');
    }
    /**
     * Sets a function that will process the request content.<br />
     * The function will be called once the request (query parameters string) has been prepared, and before the request content is sent.
     *
     * @param callback Function that will process the request content.
     */
    setCustomRequestProcessing(callback) {
        this.invokeFunction('setCustomRequestProcessing', callback);
    }
    /**
     * Sets request Content-Type header value.<br />
     * Applicable when `POST` request method is used via setRequestMethod.
     *
     * @param contentType Value for Content-Type HTTP header.
     */
    setRequestContentType(contentType) {
        this.setFunction('setRequestContentType', contentType);
    }
    /**
     * Disables the feature which groups together multiple tracking requests and send them as a bulk `POST` request.<br />
     * Disabling this feature is useful when you want to be able to replay all logs: one must use `disableQueueRequest`
     * to disable this behavior to later be able to replay logged Matomo logs (otherwise a subset of the requests
     * wouldn't be able to be replayed).
     */
    disableQueueRequest() {
        this.setFunction('disableQueueRequest');
    }
    /**
     * Defines after how many milliseconds a queued requests will be executed after the request was queued initially.
     * The higher the value the more tracking requests can be sent together at once. interval has to be at least 1000 (1000ms = 1s)
     * and defaults to 2.5 seconds.
     */
    setRequestQueueInterval(interval) {
        this.setFunction('setRequestQueueInterval', interval);
    }
    /**
     * Manually set performance metrics in milliseconds in a Single Page App or when Matomo cannot detect some metrics.
     * You can set parameters to undefined if you do not want to track this metric. At least one parameter needs to be set.
     * The set performance timings will be tracked only on the next page view. If you track another page view then you will need to set
     * the performance timings again.<br />
     * Requires Matomo 4.5 or newer.
     *
     * @param [networkTimeInMs] d
     * @param [serverTimeInMs] d
     * @param [transferTimeInMs] d
     * @param [domProcessingTimeInMs] d
     * @param [domCompletionTimeInMs] d
     * @param [onloadTimeInMs] d
     */
    setPagePerformanceTiming(networkTimeInMs, serverTimeInMs, transferTimeInMs, domProcessingTimeInMs, domCompletionTimeInMs, onloadTimeInMs) {
        this.setFunction('setPagePerformanceTiming', networkTimeInMs, serverTimeInMs, transferTimeInMs, domProcessingTimeInMs, domCompletionTimeInMs, onloadTimeInMs);
    }
    /**
     * Enables tracking of JavaScript errors.
     * Once you enable JS error tracking, JS errors will be tracked as Events and appear in the Behavior > Events report.<br />
     * Events will have the following details:<br />
     * - Event category = JavaScript Errors
     * - Event action = the URL of the page where the error occurred, with the line number appended (and the character column number)
     * - Event name = the error message as it appears in your visitors’ browser’s console (developer tools)
     */
    enableJSErrorTracking() {
        this.setFunction('enableJSErrorTracking');
    }
    static { this.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "18.2.3", ngImport: i0, type: MatomoTracker, deps: [], target: i0.ɵɵFactoryTarget.Injectable }); }
    static { this.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "18.2.3", ngImport: i0, type: MatomoTracker, providedIn: 'root' }); }
}
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "18.2.3", ngImport: i0, type: MatomoTracker, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: () => [] });

function injectMatomoTrackingScriptFactory(document, debugTracing = false) {
    return (configuration) => {
        if (!configuration.scriptUrl || !configuration.trackers?.length)
            return;
        try {
            if (debugTracing)
                console.debug('\x1B[1mngx-Matomo\x1B[m • 💉 Inject Matomo.js script in DOM for', configuration);
            const [mainTracker, ...otherTrackers] = configuration.trackers;
            window['_paq'].push(['setTrackerUrl', mainTracker.trackerUrl]);
            window['_paq'].push(['setSiteId', mainTracker.siteId.toString()]);
            otherTrackers.forEach((tracker) => window['_paq'].push(['addTracker', tracker.trackerUrl, tracker.siteId.toString()]));
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = configuration.scriptUrl;
            const firstScript = document.getElementsByTagName('script')[0];
            firstScript.parentNode?.insertBefore(script, firstScript);
        }
        catch (e) {
            if (!(e instanceof ReferenceError))
                throw e;
        }
    };
}

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
class MatomoRouteTracker {
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

/**
 * Prepares Matomo tracking by returning a list of providers.
 *
 * @param {...*} features List of features to include in order to provide the correct list of providers.
 * @returns providers required for Matomo tracking.
 */
function provideMatomoTracking(...features) {
    if (features.filter((it) => ['TRACKER_INJECTION', 'EXTERNAL_TRACKER', 'DUMMY_TRACKER'].includes(it.kind)).length > 1) {
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
                        { push: () => { } });
    }
    catch (e) {
        if (!(e instanceof ReferenceError))
            throw e;
    }
    const providers = [MatomoTracker];
    const debugTracingFeature = features.find((it) => it.kind === 'DEBUG_TRACING');
    providers.push({
        provide: MATOMO_DEBUG_TRACING,
        useValue: !!debugTracingFeature,
    });
    const routeTrackingFeature = features.find((it) => it.kind === 'ROUTE_TRACKING');
    if (routeTrackingFeature) {
        providers.push({
            provide: ENVIRONMENT_INITIALIZER,
            useFactory: (matomoRouteTracker) => () => {
                matomoRouteTracker.startTracking();
            },
            deps: [MatomoRouteTracker],
            multi: true,
        }, {
            provide: MATOMO_ROUTE_TRACKING_INTERNAL_CONFIGURATION,
            useValue: {
                ...defaultRouteTrackingConfiguration,
                ...routeTrackingFeature?.parameters,
            },
        });
    }
    const trackingConfigurationFeature = features.find((it) => it.kind === 'TRACKING_CONFIGURATION');
    if (trackingConfigurationFeature) {
        providers.push({
            provide: ENVIRONMENT_INITIALIZER,
            useFactory: (matomoTracker) => () => {
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
                    matomoTracker.enableHeartBeatTimer(trackingConfigurationFeature.parameters.heartBeatTimer);
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
        }, {
            provide: MATOMO_TRACKING_INTERNAL_CONFIGURATION,
            useValue: {
                ...defaultTrackingConfiguration,
                ...trackingConfigurationFeature?.parameters,
            },
        });
    }
    const mockedTrackerFeature = features.find((it) => it.kind === 'DUMMY_TRACKER');
    if (mockedTrackerFeature) {
        // TODO: Changer l'injection des fonctions set / get / invoke
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const preloadedTrackerFeature = features.find((it) => it.kind === 'EXTERNAL_TRACKER');
    const trackerInjectionFeature = features.find((it) => it.kind === 'TRACKER_INJECTION');
    if (trackerInjectionFeature) {
        providers.push({
            provide: ENVIRONMENT_INITIALIZER,
            useFactory: (trackers, document, debugTracing) => () => trackers.then(injectMatomoTrackingScriptFactory(document, debugTracing)),
            deps: [MATOMO_TRACKERS_INTERNAL_CONFIGURATION, DOCUMENT, MATOMO_DEBUG_TRACING],
            multi: true,
        });
    }
    return [
        ...providers,
        {
            provide: MATOMO_TRACKERS_INTERNAL_CONFIGURATION,
            useFactory: () => Promise.all([defaultTrackers, trackerInjectionFeature?.parameters]).then(([defaultTrackers, trackers]) => ({
                ...defaultTrackers,
                ...trackers,
            })),
        },
        {
            provide: ENVIRONMENT_INITIALIZER,
            useFactory: (platformId) => () => {
                if (!isPlatformBrowser(platformId))
                    console.warn('ngx-Matomo is active only on browser platform.');
            },
            deps: [PLATFORM_ID],
            multi: true,
        },
        {
            provide: MATOMO_TRACKER_SET_FUNCTION,
            useFactory: (platformId, debugTracing) => setFunctionFactory(!isPlatformBrowser(platformId), debugTracing),
            deps: [PLATFORM_ID, MATOMO_DEBUG_TRACING],
        },
        {
            provide: MATOMO_TRACKER_GET_FUNCTION,
            useFactory: (platformId, debugTracing) => getFunctionFactory(!isPlatformBrowser(platformId), debugTracing),
            deps: [PLATFORM_ID],
        },
        {
            provide: MATOMO_TRACKER_INVOKE_FUNCTION,
            useFactory: (platformId, debugTracing) => invokeFunctionFactory(!isPlatformBrowser(platformId), debugTracing),
            deps: [PLATFORM_ID],
        },
    ];
}

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
function withTrackers(trackers) {
    return {
        kind: 'TRACKER_INJECTION',
        parameters: Promise.resolve(trackers).then((it) => ({ trackers: [], ...it })),
    };
}
function withExternalTracker() {
    return { kind: 'EXTERNAL_TRACKER' };
}
function withDummyTracker() {
    return { kind: 'DUMMY_TRACKER' };
}
function withConfig(configuration) {
    return { kind: 'TRACKING_CONFIGURATION', parameters: configuration };
}
function withRouteTracking(configuration) {
    return { kind: 'ROUTE_TRACKING', parameters: configuration };
}
function withDebugTracing() {
    return { kind: 'DEBUG_TRACING' };
}

/*
 * Public API Surface of ngx-matomo
 */

/**
 * Generated bundle index. Do not edit.
 */

export { MatomoTracker, provideMatomoTracking, withConfig, withDebugTracing, withDummyTracker, withExternalTracker, withRouteTracking, withTrackers };
//# sourceMappingURL=ngx-matomo.mjs.map