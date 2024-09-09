import { Injectable, inject } from '@angular/core';
import { MATOMO_TRACKER_GET_FUNCTION, MATOMO_TRACKER_INVOKE_FUNCTION, MATOMO_TRACKER_SET_FUNCTION, } from './matomo-functions';
import * as i0 from "@angular/core";
/**
 * Wrapper for functions available in the Matomo Javascript tracker.
 *
 * @export
 */
export class MatomoTracker {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWF0b21vLXRyYWNrZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25neC1tYXRvbW8vc3JjL2xpYi9tYXRvbW8tdHJhY2tlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRW5ELE9BQU8sRUFDTCwyQkFBMkIsRUFDM0IsOEJBQThCLEVBQzlCLDJCQUEyQixHQUM1QixNQUFNLG9CQUFvQixDQUFDOztBQWlCNUI7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBS3hCO1FBSlEsZ0JBQVcsR0FBRyxNQUFNLENBQUMsMkJBQTJCLENBQUMsQ0FBQztRQUNsRCxnQkFBVyxHQUFHLE1BQU0sQ0FBQywyQkFBMkIsQ0FBQyxDQUFDO1FBQ2xELG1CQUFjLEdBQUcsTUFBTSxDQUFDLDhCQUE4QixDQUFDLENBQUM7UUFHOUQsSUFBSSxDQUFDO1lBQ0gsSUFBSSxPQUFPLE1BQU0sQ0FBQyxNQUFNLENBQUMsS0FBSyxXQUFXLEVBQUUsQ0FBQztnQkFDMUMsT0FBTyxDQUFDLElBQUksQ0FBQyxzQ0FBc0MsQ0FBQyxDQUFDO1lBQ3ZELENBQUM7UUFDSCxDQUFDO1FBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQztZQUNYLElBQUksQ0FBQyxDQUFDLENBQUMsWUFBWSxjQUFjLENBQUM7Z0JBQUUsTUFBTSxDQUFDLENBQUM7UUFDOUMsQ0FBQztJQUNILENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsYUFBYSxDQUFDLFdBQW9CO1FBQ2hDLE1BQU0sSUFBSSxHQUFjLEVBQUUsQ0FBQztRQUMzQixJQUFJLFdBQVcsRUFBRSxDQUFDO1lBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUNELElBQUksQ0FBQyxXQUFXLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxDQUFDO0lB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Ozs7T0FLRztJQUNILHFCQUFxQixDQUFDLFdBQW1CO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLEVBQUUsV0FBVyxDQUFDLENBQUM7SUFDekQsQ0FBQztJQUVEOzs7OztPQUtHO0lBQ0gsbUJBQW1CO1FBQ2pCLElBQUksQ0FBQyxXQUFXLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILHVCQUF1QixDQUFDLFFBQWdCO1FBQ3RDLElBQUksQ0FBQyxXQUFXLENBQUMseUJBQXlCLEVBQUUsUUFBUSxDQUFDLENBQUM7SUFDeEQsQ0FBQztJQUVEOzs7Ozs7Ozs7Ozs7O09BYUc7SUFDSCx3QkFBd0IsQ0FDdEIsZUFBbUMsRUFDbkMsY0FBa0MsRUFDbEMsZ0JBQW9DLEVBQ3BDLHFCQUF5QyxFQUN6QyxxQkFBeUMsRUFDekMsY0FBa0M7UUFFbEMsSUFBSSxDQUFDLFdBQVcsQ0FDZCwwQkFBMEIsRUFDMUIsZUFBZSxFQUNmLGNBQWMsRUFDZCxnQkFBZ0IsRUFDaEIscUJBQXFCLEVBQ3JCLHFCQUFxQixFQUNyQixjQUFjLENBQ2YsQ0FBQztJQUNKLENBQUM7SUFFRDs7Ozs7OztPQU9HO0lBQ0gscUJBQXFCO1FBQ25CLElBQUksQ0FBQyxXQUFXLENBQUMsdUJBQXVCLENBQUMsQ0FBQztJQUM1QyxDQUFDOzhHQWwwQ1UsYUFBYTtrSEFBYixhQUFhLGNBREEsTUFBTTs7MkZBQ25CLGFBQWE7a0JBRHpCLFVBQVU7bUJBQUMsRUFBRSxVQUFVLEVBQUUsTUFBTSxFQUFFIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgaW5qZWN0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7XG4gIE1BVE9NT19UUkFDS0VSX0dFVF9GVU5DVElPTixcbiAgTUFUT01PX1RSQUNLRVJfSU5WT0tFX0ZVTkNUSU9OLFxuICBNQVRPTU9fVFJBQ0tFUl9TRVRfRlVOQ1RJT04sXG59IGZyb20gJy4vbWF0b21vLWZ1bmN0aW9ucyc7XG5cbmRlY2xhcmUgZ2xvYmFsIHtcbiAgLyoqXG4gICAqIEV4dGVuZCBXaW5kb3cgaW50ZXJmYWNlIGluIG9yZGVyIHRvIGludHJvZHVjZSB0aGUgTWF0b21vIF9wYXEgYXR0cmlidXRlXG4gICAqL1xuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L2NvbnNpc3RlbnQtdHlwZS1kZWZpbml0aW9uc1xuICBpbnRlcmZhY2UgV2luZG93IHtcbiAgICBfcGFxOiB7IHB1c2g6IChhcmdzOiB1bmtub3duW10pID0+IHZvaWQgfTtcbiAgfVxufVxuXG4vKipcbiAqIE1hdG9tbyBzY29wZVxuICovXG50eXBlIE1hdG9tb1Njb3BlID0gJ3BhZ2UnIHwgJ3Zpc2l0JyB8ICdldmVudCc7XG5cbi8qKlxuICogV3JhcHBlciBmb3IgZnVuY3Rpb25zIGF2YWlsYWJsZSBpbiB0aGUgTWF0b21vIEphdmFzY3JpcHQgdHJhY2tlci5cbiAqXG4gKiBAZXhwb3J0XG4gKi9cbkBJbmplY3RhYmxlKHsgcHJvdmlkZWRJbjogJ3Jvb3QnIH0pXG5leHBvcnQgY2xhc3MgTWF0b21vVHJhY2tlciB7XG4gIHByaXZhdGUgc2V0RnVuY3Rpb24gPSBpbmplY3QoTUFUT01PX1RSQUNLRVJfU0VUX0ZVTkNUSU9OKTtcbiAgcHJpdmF0ZSBnZXRGdW5jdGlvbiA9IGluamVjdChNQVRPTU9fVFJBQ0tFUl9HRVRfRlVOQ1RJT04pO1xuICBwcml2YXRlIGludm9rZUZ1bmN0aW9uID0gaW5qZWN0KE1BVE9NT19UUkFDS0VSX0lOVk9LRV9GVU5DVElPTik7XG5cbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdHJ5IHtcbiAgICAgIGlmICh0eXBlb2Ygd2luZG93WydfcGFxJ10gPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGNvbnNvbGUud2FybignTWF0b21vIGhhcyBub3QgeWV0IGJlZW4gaW5pdGlhbGl6ZWQhJyk7XG4gICAgICB9XG4gICAgfSBjYXRjaCAoZSkge1xuICAgICAgaWYgKCEoZSBpbnN0YW5jZW9mIFJlZmVyZW5jZUVycm9yKSkgdGhyb3cgZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogTG9ncyBhIHZpc2l0IHRvIHRoaXMgcGFnZS5cbiAgICpcbiAgICogQHBhcmFtIFtjdXN0b21UaXRsZV0gT3B0aW9uYWwgdGl0bGUgb2YgdGhlIHZpc2l0ZWQgcGFnZS5cbiAgICovXG4gIHRyYWNrUGFnZVZpZXcoY3VzdG9tVGl0bGU/OiBzdHJpbmcpOiB2b2lkIHtcbiAgICBjb25zdCBhcmdzOiB1bmtub3duW10gPSBbXTtcbiAgICBpZiAoY3VzdG9tVGl0bGUpIHtcbiAgICAgIGFyZ3MucHVzaChjdXN0b21UaXRsZSk7XG4gICAgfVxuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3RyYWNrUGFnZVZpZXcnLCBhcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBMb2dzIGFuIGV2ZW50IHdpdGggYW4gZXZlbnQgY2F0ZWdvcnkgKFZpZGVvcywgTXVzaWMsIEdhbWVz4oCmKSwgYW4gZXZlbnQgYWN0aW9uIChQbGF5LCBQYXVzZSwgRHVyYXRpb24sXG4gICAqIEFkZCBQbGF5bGlzdCwgRG93bmxvYWRlZCwgQ2xpY2tlZOKApiksIGFuZCBhbiBvcHRpb25hbCBldmVudCBuYW1lIGFuZCBvcHRpb25hbCBudW1lcmljIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0gY2F0ZWdvcnkgQ2F0ZWdvcnkgb2YgdGhlIGV2ZW50LlxuICAgKiBAcGFyYW0gYWN0aW9uIEFjdGlvbiBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSBbbmFtZV0gT3B0aW9uYWwgbmFtZSBvZiB0aGUgZXZlbnQuXG4gICAqIEBwYXJhbSBbdmFsdWVdIE9wdGlvbmFsIHZhbHVlIGZvciB0aGUgZXZlbnQuXG4gICAqL1xuICB0cmFja0V2ZW50KGNhdGVnb3J5OiBzdHJpbmcsIGFjdGlvbjogc3RyaW5nLCBuYW1lPzogc3RyaW5nLCB2YWx1ZT86IG51bWJlcik6IHZvaWQge1xuICAgIGNvbnN0IGFyZ3M6IHVua25vd25bXSA9IFtjYXRlZ29yeSwgYWN0aW9uXTtcbiAgICBpZiAobmFtZSkge1xuICAgICAgYXJncy5wdXNoKG5hbWUpO1xuICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgYXJncy5wdXNoKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5zZXRGdW5jdGlvbigndHJhY2tFdmVudCcsIC4uLmFyZ3MpO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYW4gaW50ZXJuYWwgc2l0ZSBzZWFyY2ggZm9yIGEgc3BlY2lmaWMga2V5d29yZCwgaW4gYW4gb3B0aW9uYWwgY2F0ZWdvcnksXG4gICAqIHNwZWNpZnlpbmcgdGhlIG9wdGlvbmFsIGNvdW50IG9mIHNlYXJjaCByZXN1bHRzIGluIHRoZSBwYWdlLlxuICAgKlxuICAgKiBAcGFyYW0ga2V5d29yZCBLZXl3b3JkcyBvZiB0aGUgc2VhcmNoIHF1ZXJ5LlxuICAgKiBAcGFyYW0gW2NhdGVnb3J5XSBPcHRpb25hbCBjYXRlZ29yeSBvZiB0aGUgc2VhcmNoIHF1ZXJ5LlxuICAgKiBAcGFyYW0gW3Jlc3VsdHNDb3VudF0gT3B0aW9uYWwgbnVtYmVyIG9mIHJlc3VsdHMgcmV0dXJuZWQgYnkgdGhlIHNlYXJjaCBxdWVyeS5cbiAgICovXG4gIHRyYWNrU2l0ZVNlYXJjaChrZXl3b3JkOiBzdHJpbmcsIGNhdGVnb3J5Pzogc3RyaW5nLCByZXN1bHRzQ291bnQ/OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBhcmdzOiB1bmtub3duW10gPSBba2V5d29yZF07XG4gICAgaWYgKGNhdGVnb3J5KSB7XG4gICAgICBhcmdzLnB1c2goY2F0ZWdvcnkpO1xuICAgICAgaWYgKHR5cGVvZiByZXN1bHRzQ291bnQgPT09ICdudW1iZXInKSB7XG4gICAgICAgIGFyZ3MucHVzaChyZXN1bHRzQ291bnQpO1xuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLnNldEZ1bmN0aW9uKCd0cmFja1NpdGVTZWFyY2gnLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYW51YWxseSBsb2dzIGEgY29udmVyc2lvbiBmb3IgdGhlIG51bWVyaWMgZ29hbCBJRCwgd2l0aCBhbiBvcHRpb25hbCBudW1lcmljIGN1c3RvbSByZXZlbnVlIGN1c3RvbVJldmVudWUuXG4gICAqXG4gICAqIEBwYXJhbSBpZEdvYWwgbnVtZXJpYyBJRCBvZiB0aGUgZ29hbCB0byBsb2cgYSBjb252ZXJzaW9uIGZvci5cbiAgICogQHBhcmFtIFtjdXN0b21SZXZlbnVlXSBPcHRpb25hbCBjdXN0b20gcmV2ZW51ZSB0byBsb2cgZm9yIHRoZSBnb2FsLlxuICAgKi9cbiAgdHJhY2tHb2FsKGlkR29hbDogbnVtYmVyLCBjdXN0b21SZXZlbnVlPzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgYXJnczogdW5rbm93bltdID0gW2lkR29hbF07XG4gICAgaWYgKHR5cGVvZiBjdXN0b21SZXZlbnVlID09PSAnbnVtYmVyJykge1xuICAgICAgYXJncy5wdXNoKGN1c3RvbVJldmVudWUpO1xuICAgICAgdGhpcy5zZXRGdW5jdGlvbigndHJhY2tHb2FsJywgLi4uYXJncyk7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IGxvZ3MgYSBjbGljayBmcm9tIHlvdXIgb3duIGNvZGUuXG4gICAqXG4gICAqIEBwYXJhbSB1cmwgRnVsbCBVUkwgd2hpY2ggaXMgdG8gYmUgdHJhY2tlZCBhcyBhIGNsaWNrLlxuICAgKiBAcGFyYW0gbGlua1R5cGUgRWl0aGVyICdsaW5rJyBmb3IgYW4gb3V0bGluayBvciAnZG93bmxvYWQnIGZvciBhIGRvd25sb2FkLlxuICAgKi9cbiAgdHJhY2tMaW5rKHVybDogc3RyaW5nLCBsaW5rVHlwZTogJ2xpbmsnIHwgJ2Rvd25sb2FkJyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3RyYWNrTGluaycsIHVybCwgbGlua1R5cGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYW5zIHRoZSBlbnRpcmUgRE9NIGZvciBhbGwgY29udGVudCBibG9ja3MgYW5kIHRyYWNrcyBhbGwgaW1wcmVzc2lvbnMgb25jZSB0aGUgRE9NIHJlYWR5IGV2ZW50IGhhcyBiZWVuIHRyaWdnZXJlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubWF0b21vLm9yZy9ndWlkZXMvY29udGVudC10cmFja2luZ3xDb250ZW50IFRyYWNraW5nfVxuICAgKi9cbiAgdHJhY2tBbGxDb250ZW50SW1wcmVzc2lvbnMoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbigndHJhY2tBbGxDb250ZW50SW1wcmVzc2lvbnMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTY2FucyB0aGUgZW50aXJlIERPTSBmb3IgYWxsIGNvbnRlbnQgYmxvY2tzIGFzIHNvb24gYXMgdGhlIHBhZ2UgaXMgbG9hZGVkLjxiciAvPlxuICAgKiBJdCB0cmFja3MgYW4gaW1wcmVzc2lvbiBvbmx5IGlmIGEgY29udGVudCBibG9jayBpcyBhY3R1YWxseSB2aXNpYmxlLlxuICAgKlxuICAgKiBAcGFyYW0gY2hlY2tPblNjcm9sbCBJZiB0cnVlLCBjaGVja3MgZm9yIG5ldyBjb250ZW50IGJsb2NrcyB3aGlsZSBzY3JvbGxpbmcgdGhlIHBhZ2UuXG4gICAqIEBwYXJhbSB0aW1lSW50ZXJ2YWwgRHVyYXRpb24sIGluIG1pbGxpc2Vjb25kcywgYmV0d2VlbiB0d28gY2hlY2tzIHVwb24gc2Nyb2xsLlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5tYXRvbW8ub3JnL2d1aWRlcy9jb250ZW50LXRyYWNraW5nfENvbnRlbnQgVHJhY2tpbmd9XG4gICAqL1xuICB0cmFja1Zpc2libGVDb250ZW50SW1wcmVzc2lvbnMoY2hlY2tPblNjcm9sbDogYm9vbGVhbiwgdGltZUludGVydmFsOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCd0cmFja1Zpc2libGVDb250ZW50SW1wcmVzc2lvbnMnLCBjaGVja09uU2Nyb2xsLCB0aW1lSW50ZXJ2YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNjYW5zIHRoZSBnaXZlbiBET00gbm9kZSBhbmQgaXRzIGNoaWxkcmVuIGZvciBjb250ZW50IGJsb2NrcyBhbmQgdHJhY2tzIGFuIGltcHJlc3Npb24gZm9yIHRoZW1cbiAgICogaWYgbm8gaW1wcmVzc2lvbiB3YXMgYWxyZWFkeSB0cmFja2VkIGZvciBpdC5cbiAgICpcbiAgICogQHBhcmFtIG5vZGUgRE9NIG5vZGUgaW4gd2hpY2ggdG8gbG9vayBmb3IgY29udGVudCBibG9ja3Mgd2hpY2ggaGF2ZSBub3QgYmVlbiBwcmV2aW91c2x5IHRyYWNrZWQuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvZ3VpZGVzL2NvbnRlbnQtdHJhY2tpbmd8Q29udGVudCBUcmFja2luZ31cbiAgICovXG4gIHRyYWNrQ29udGVudEltcHJlc3Npb25zV2l0aGluTm9kZShub2RlOiBOb2RlKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbigndHJhY2tDb250ZW50SW1wcmVzc2lvbnNXaXRoaW5Ob2RlJywgbm9kZSk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tzIGFuIGludGVyYWN0aW9uIHdpdGggdGhlIGdpdmVuIERPTSBub2RlL2NvbnRlbnQgYmxvY2suXG4gICAqXG4gICAqIEBwYXJhbSBub2RlIERPTSBub2RlIGZvciB3aGljaCB0byB0cmFjayBhIGNvbnRlbnQgaW50ZXJhY3Rpb24uXG4gICAqIEBwYXJhbSBjb250ZW50SW50ZXJhY3Rpb24gTmFtZSBvZiB0aGUgY29udGVudCBpbnRlcmFjdGlvbi5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubWF0b21vLm9yZy9ndWlkZXMvY29udGVudC10cmFja2luZ3xDb250ZW50IFRyYWNraW5nfVxuICAgKi9cbiAgdHJhY2tDb250ZW50SW50ZXJhY3Rpb25Ob2RlKG5vZGU6IE5vZGUsIGNvbnRlbnRJbnRlcmFjdGlvbjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbigndHJhY2tDb250ZW50SW50ZXJhY3Rpb25Ob2RlJywgbm9kZSwgY29udGVudEludGVyYWN0aW9uKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFja3MgYSBjb250ZW50IGltcHJlc3Npb24gdXNpbmcgdGhlIHNwZWNpZmllZCB2YWx1ZXMuXG4gICAqXG4gICAqIEBwYXJhbSBjb250ZW50TmFtZSBDb250ZW50IG5hbWUuXG4gICAqIEBwYXJhbSBjb250ZW50UGllY2UgQ29udGVudCBwaWVjZS5cbiAgICogQHBhcmFtIGNvbnRlbnRUYXJnZXQgQ29udGVudCB0YXJnZXQuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvZ3VpZGVzL2NvbnRlbnQtdHJhY2tpbmd8Q29udGVudCBUcmFja2luZ31cbiAgICovXG4gIHRyYWNrQ29udGVudEltcHJlc3Npb24oY29udGVudE5hbWU6IHN0cmluZywgY29udGVudFBpZWNlOiBzdHJpbmcsIGNvbnRlbnRUYXJnZXQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3RyYWNrQ29udGVudEltcHJlc3Npb24nLCBjb250ZW50TmFtZSwgY29udGVudFBpZWNlLCBjb250ZW50VGFyZ2V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFja3MgYSBjb250ZW50IGludGVyYWN0aW9uIHVzaW5nIHRoZSBzcGVjaWZpZWQgdmFsdWVzLlxuICAgKlxuICAgKiBAcGFyYW0gY29udGVudEludGVyYWN0aW9uIENvbnRlbnQgaW50ZXJhY3Rpb24uXG4gICAqIEBwYXJhbSBjb250ZW50TmFtZSBDb250ZW50IG5hbWUuXG4gICAqIEBwYXJhbSBjb250ZW50UGllY2UgQ29udGVudCBwaWVjZS5cbiAgICogQHBhcmFtIGNvbnRlbnRUYXJnZXQgQ29udGVudCB0YXJnZXQuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vZGV2ZWxvcGVyLm1hdG9tby5vcmcvZ3VpZGVzL2NvbnRlbnQtdHJhY2tpbmd8Q29udGVudCBUcmFja2luZ31cbiAgICovXG4gIHRyYWNrQ29udGVudEludGVyYWN0aW9uKFxuICAgIGNvbnRlbnRJbnRlcmFjdGlvbjogc3RyaW5nLFxuICAgIGNvbnRlbnROYW1lOiBzdHJpbmcsXG4gICAgY29udGVudFBpZWNlOiBzdHJpbmcsXG4gICAgY29udGVudFRhcmdldDogc3RyaW5nLFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKFxuICAgICAgJ3RyYWNrQ29udGVudEludGVyYWN0aW9uJyxcbiAgICAgIGNvbnRlbnRJbnRlcmFjdGlvbixcbiAgICAgIGNvbnRlbnROYW1lLFxuICAgICAgY29udGVudFBpZWNlLFxuICAgICAgY29udGVudFRhcmdldCxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIExvZ3MgYWxsIGZvdW5kIGNvbnRlbnQgYmxvY2tzIHdpdGhpbiBhIHBhZ2UgdG8gdGhlIGNvbnNvbGUuPGJyIC8+XG4gICAqIFRoaXMgaXMgdXNlZnVsIHRvIGRlYnVnIC8gdGVzdCBjb250ZW50IHRyYWNraW5nLlxuICAgKi9cbiAgbG9nQWxsQ29udGVudEJsb2Nrc09uUGFnZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdsb2dBbGxDb250ZW50QmxvY2tzT25QYWdlJyk7XG4gIH1cblxuICAvKipcbiAgICogU2VuZHMgYSBwaW5nIHJlcXVlc3QuPGJyIC8+XG4gICAqIFBpbmcgcmVxdWVzdHMgZG8gbm90IHRyYWNrIG5ldyBhY3Rpb25zLlxuICAgKiBJZiB0aGV5IGFyZSBzZW50IHdpdGhpbiB0aGUgc3RhbmRhcmQgdmlzaXQgbGVuZ3RoLCB0aGV5IHdpbGwgZXh0ZW5kIHRoZSBleGlzdGluZyB2aXNpdCBhbmQgdGhlIGN1cnJlbnQgbGFzdCBhY3Rpb24gZm9yIHRoZSB2aXNpdC5cbiAgICogSWYgc2VudCBhZnRlciB0aGUgc3RhbmRhcmQgdmlzaXQgbGVuZ3RoLCBwaW5nIHJlcXVlc3RzIHdpbGwgY3JlYXRlIGEgbmV3IHZpc2l0IHVzaW5nIHRoZSBsYXN0IGFjdGlvbiBpbiB0aGUgbGFzdCBrbm93biB2aXNpdC48YnIgLz5cbiAgICogU2VlIGFsc28gZW5hYmxlSGVhcnRCZWF0VGltZXIuXG4gICAqL1xuICBwaW5nKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3BpbmcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJbnN0YWxscyBhIEhlYXJ0IGJlYXQgdGltZXIgdGhhdCB3aWxsIHNlbmQgYWRkaXRpb25hbCByZXF1ZXN0cyB0byBNYXRvbW8gaW4gb3JkZXIgdG8gYmV0dGVyIG1lYXN1cmUgdGhlIHRpbWUgc3BlbnQgaW4gdGhlIHZpc2l0LlxuICAgKiBUaGVzZSByZXF1ZXN0cyB3aWxsIGJlIHNlbnQgb25seSB3aGVuIHRoZSB1c2VyIGlzIGFjdGl2ZWx5IHZpZXdpbmcgdGhlIHBhZ2UgKHdoZW4gdGhlIHRhYiBpcyBhY3RpdmUgYW5kIGluIGZvY3VzKS5cbiAgICogVGhlc2UgcmVxdWVzdHMgd2lsbCBub3QgdHJhY2sgYWRkaXRpb25hbCBhY3Rpb25zIG9yIHBhZ2V2aWV3cy48YnIgLz5cbiAgICogQnkgZGVmYXVsdCwgYWN0aXZlVGltZUluU2Vjb25kcyBpcyBzZXQgdG8gMTUgc2Vjb25kcy4gTWVhbmluZyBvbmx5IGlmIHRoZSBwYWdlIHdhcyB2aWV3ZWQgZm9yIGF0IGxlYXN0IDE1IHNlY29uZHMgKGFuZCB0aGUgdXNlclxuICAgKiBsZWF2ZXMgdGhlIHBhZ2Ugb3IgZm9jdXNlcyBhd2F5IGZyb20gdGhlIHRhYikgdGhlbiBhIHBpbmcgcmVxdWVzdCB3aWxsIGJlIHNlbnQuXG4gICAqIEBwYXJhbSBhY3RpdmVUaW1lSW5zZWNvbmRzIERlbGF5LCBpbiBzZWNvbmRzLCBiZXR3ZWVuIHR3byBoZWFydCBiZWF0cyB0byB0aGUgc2VydmVyLlxuICAgKiBAc2VlIHtAbGluayBwaW5nfVxuICAgKiBAc2VlIHtAbGluayBodHRwczovL2RldmVsb3Blci5tYXRvbW8ub3JnL2d1aWRlcy90cmFja2luZy1qYXZhc2NyaXB0LWd1aWRlI2FjY3VyYXRlbHktbWVhc3VyZS10aGUtdGltZS1zcGVudC1vbi1lYWNoLXBhZ2V9XG4gICAqL1xuICBlbmFibGVIZWFydEJlYXRUaW1lcihhY3RpdmVUaW1lSW5zZWNvbmRzPzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgYXJnczogdW5rbm93bltdID0gW107XG4gICAgaWYgKGFjdGl2ZVRpbWVJbnNlY29uZHMpIHtcbiAgICAgIGFyZ3MucHVzaChhY3RpdmVUaW1lSW5zZWNvbmRzKTtcbiAgICB9XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZW5hYmxlSGVhcnRCZWF0VGltZXInLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZWNvcmRzIGhvdyBsb25nIHRoZSBwYWdlIGhhcyBiZWVuIHZpZXdlZCBpZiB0aGUgbWluaW11bVZpc2l0TGVuZ3RoIGlzIGF0dGFpbmVkO1xuICAgKiB0aGUgaGVhcnRCZWF0RGVsYXkgZGV0ZXJtaW5lcyBob3cgZnJlcXVlbnRseSB0byB1cGRhdGUgdGhlIHNlcnZlci5cbiAgICpcbiAgICogQHBhcmFtIG1pbmltdW1WaXNpdExlbmd0aCBEdXJhdGlvbiBiZWZvcmUgbm90aWZ5aW5nIHRoZSBzZXJ2ZXIgZm9yIHRoZSBkdXJhdGlvbiBvZiB0aGUgdmlzaXQgdG8gYSBwYWdlLlxuICAgKiBAcGFyYW0gaGVhcnRCZWF0RGVsYXkgRGVsYXksIGluIHNlY29uZHMsIGJldHdlZW4gdHdvIHVwZGF0ZXMgdG8gdGhlIHNlcnZlci5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9kZXZlbG9wZXIubWF0b21vLm9yZy9ndWlkZXMvdHJhY2tpbmctamF2YXNjcmlwdC1ndWlkZSNhY2N1cmF0ZWx5LW1lYXN1cmUtdGhlLXRpbWUtc3BlbnQtb24tZWFjaC1wYWdlfVxuICAgKi9cbiAgc2V0SGVhcnRCZWF0VGltZXIobWluaW11bVZpc2l0TGVuZ3RoOiBudW1iZXIsIGhlYXJ0QmVhdERlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRIZWFydEJlYXRUaW1lcicsIG1pbmltdW1WaXNpdExlbmd0aCwgaGVhcnRCZWF0RGVsYXkpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluc3RhbGxzIGxpbmsgdHJhY2tpbmcgb24gYWxsIGFwcGxpY2FibGUgbGluayBlbGVtZW50cy5cbiAgICpcbiAgICogQHBhcmFtIFtlbmFibGU9ZmFsc2VdIFNldCB0byB0cnVlIHRvIHVzZSBwc2V1ZG8gY2xpY2staGFuZGxlciAodHJlYXQgbWlkZGxlIGNsaWNrIGFuZCBvcGVuIGNvbnRleHRtZW51IGFzIGxlZnQgY2xpY2spLjxiciAvPlxuICAgKiBBIHJpZ2h0IGNsaWNrIChvciBhbnkgY2xpY2sgdGhhdCBvcGVucyB0aGUgY29udGV4dCBtZW51KSBvbiBhIGxpbmsgd2lsbCBiZSB0cmFja2VkIGFzIGNsaWNrZWQgZXZlbiBpZiBcIk9wZW4gaW4gbmV3IHRhYlwiIGlzXG4gICAqIG5vdCBzZWxlY3RlZC48YnIgLz5cbiAgICogSWYgZmFsc2UgKGRlZmF1bHQpLCBub3RoaW5nIHdpbGwgYmUgdHJhY2tlZCBvbiBvcGVuIGNvbnRleHQgbWVudSBvciBtaWRkbGUgY2xpY2suXG4gICAqL1xuICBlbmFibGVMaW5rVHJhY2tpbmcoZW5hYmxlID0gZmFsc2UpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdlbmFibGVMaW5rVHJhY2tpbmcnLCBlbmFibGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdHJhY2tpbmcgb2YgYGZpbGU6Ly9gIHByb3RvY29sIGFjdGlvbnMuPGJyIC8+XG4gICAqIEJ5IGRlZmF1bHQsIHRoZSBgZmlsZTovL2AgcHJvdG9jb2wgaXMgbm90IHRyYWNrZWQuXG4gICAqL1xuICBlbmFibGVGaWxlVHJhY2tpbmcoKSB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZW5hYmxlRmlsZVRyYWNraW5nJyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgcGFnZSBwZXJmb3JtYW5jZSB0cmFja2luZy5cbiAgICovXG4gIGRpc2FibGVQZXJmb3JtYW5jZVRyYWNraW5nKCkge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ2Rpc2FibGVQZXJmb3JtYW5jZVRyYWNraW5nJyk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyBjcm9zcyBkb21haW4gbGlua2luZy4gQnkgZGVmYXVsdCwgdGhlIHZpc2l0b3IgSUQgdGhhdCBpZGVudGlmaWVzIGEgdW5pcXVlIHZpc2l0b3IgaXMgc3RvcmVkIGluIHRoZSBicm93c2VyJ3NcbiAgICogZmlyc3QgcGFydHkgY29va2llcy48YnIgLz5cbiAgICogVGhpcyBtZWFucyB0aGUgY29va2llIGNhbiBvbmx5IGJlIGFjY2Vzc2VkIGJ5IHBhZ2VzIG9uIHRoZSBzYW1lIGRvbWFpbi48YnIgLz5cbiAgICogSWYgeW91IG93biBtdWx0aXBsZSBkb21haW5zIGFuZCB3b3VsZCBsaWtlIHRvIHRyYWNrIGFsbCB0aGUgYWN0aW9ucyBhbmQgcGFnZXZpZXdzIG9mIGEgc3BlY2lmaWMgdmlzaXRvciBpbnRvIHRoZSBzYW1lIHZpc2l0LFxuICAgKiB5b3UgbWF5IGVuYWJsZSBjcm9zcyBkb21haW4gbGlua2luZy48YnIgLz5cbiAgICogV2hlbmV2ZXIgYSB1c2VyIGNsaWNrcyBvbiBhIGxpbmsgaXQgd2lsbCBhcHBlbmQgYSBVUkwgcGFyYW1ldGVyIHBrX3ZpZCB0byB0aGUgY2xpY2tlZCBVUkwgd2hpY2ggZm9yd2FyZHMgdGhlIGN1cnJlbnRcbiAgICogdmlzaXRvciBJRCB2YWx1ZSB0byB0aGUgcGFnZSBvZiB0aGUgZGlmZmVyZW50IGRvbWFpbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2ZhcS9ob3ctdG8vZmFxXzIzNjU0L3xDcm9zcyBEb21haW4gTGlua2luZ31cbiAgICovXG4gIGVuYWJsZUNyb3NzRG9tYWluTGlua2luZygpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdlbmFibGVDcm9zc0RvbWFpbkxpbmtpbmcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjcm9zcyBkb21haW4gbGlua2luZyB0aW1lb3V0LjxiciAvPlxuICAgKiBCeSBkZWZhdWx0LCB0aGUgdHdvIHZpc2l0cyBhY3Jvc3MgZG9tYWlucyB3aWxsIGJlIGxpbmtlZCB0b2dldGhlciB3aGVuIHRoZSBsaW5rIGlzIGNsaWNrZWQgYW5kIHRoZSBwYWdlIGlzIGxvYWRlZCB3aXRoaW5cbiAgICogYSAxODAgc2Vjb25kcyB0aW1lb3V0IHdpbmRvdy5cbiAgICpcbiAgICogQHBhcmFtIHRpbWVvdXQgVGltZW91dCwgaW4gc2Vjb25kcywgYmV0d2VlbiB0d28gYWN0aW9ucyBhY3Jvc3MgdHdvIGRvbWFpbnMgYmVmb3JlIGNyZWF0aW5nIGEgbmV3IHZpc2l0LlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL21hdG9tby5vcmcvZmFxL2hvdy10by9mYXFfMjM2NTQvfENyb3NzIERvbWFpbiBMaW5raW5nfVxuICAgKi9cbiAgc2V0Q3Jvc3NEb21haW5MaW5raW5nVGltZW91dCh0aW1lb3V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRDcm9zc0RvbWFpbkxpbmtpbmdUaW1lb3V0JywgdGltZW91dCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgcXVlcnkgcGFyYW1ldGVyIHRvIGFwcGVuZCB0byBsaW5rcyB0byBoYW5kbGUgY3Jvc3MgZG9tYWluIGxpbmtpbmcuPGJyIC8+XG4gICAqIFVzZSB0aGlzIHRvIGFkZCBjcm9zcyBkb21haW4gc3VwcG9ydCBmb3IgbGlua3MgdGhhdCBhcmUgYWRkZWQgdG8gdGhlIERPTSBkeW5hbWljYWxseS5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBgcGtfdmlkYCBxdWVyeSBwYXJhbWV0ZXIuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9mYXEvaG93LXRvL2ZhcV8yMzY1NC98Q3Jvc3MgRG9tYWluIExpbmtpbmd9XG4gICAqL1xuICBnZXRDcm9zc0RvbWFpbkxpbmtpbmdVcmxQYXJhbWV0ZXIoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRDcm9zc0RvbWFpbkxpbmtpbmdVcmxQYXJhbWV0ZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBQcmV2ZW50cyBjYW1wYWlnbiBwYXJhbWV0ZXJzIGZyb20gYmVpbmcgc2VudCB0byB0aGUgdHJhY2tlci48YnIgLz5cbiAgICogQnkgZGVmYXVsdCwgTWF0b21vIHdpbGwgc2VuZCBjYW1wYWlnbiBwYXJhbWV0ZXJzIChtdG0sIHV0bSwgZXRjLikgdG8gdGhlIHRyYWNrZXIgYW5kIHJlY29yZCB0aGF0IGluZm9ybWF0aW9uLlxuICAgKiBTb21lIHByaXZhY3kgcmVndWxhdGlvbnMgbWF5IG5vdCBhbGxvdyBmb3IgdGhpcyBpbmZvcm1hdGlvbiB0byBiZSBjb2xsZWN0ZWQuPGJyIC8+XG4gICAqIFRoaXMgbWV0aG9kIGlzIGF2YWlsYWJsZSBhcyBvZiBNYXRvbW8gNS4xLlxuICAgKi9cbiAgZGlzYWJsZUNhbXBhaWduUGFyYW1ldGVycygpIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkaXNhYmxlQ2FtcGFpZ25QYXJhbWV0ZXJzJyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIGRvY3VtZW50LnRpdGxlXG4gICAqXG4gICAqIEBwYXJhbSB0aXRsZSBUaXRsZSBvZiB0aGUgZG9jdW1lbnQuXG4gICAqL1xuICBzZXREb2N1bWVudFRpdGxlKHRpdGxlOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXREb2N1bWVudFRpdGxlJywgdGl0bGUpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYXJyYXkgb2YgaG9zdG5hbWVzIG9yIGRvbWFpbnMgdG8gYmUgdHJlYXRlZCBhcyBsb2NhbC48YnIgLz5cbiAgICogRm9yIHdpbGRjYXJkIHN1YmRvbWFpbnMsIHlvdSBjYW4gdXNlOiBgc2V0RG9tYWlucygnLmV4YW1wbGUuY29tJylgOyBvciBgc2V0RG9tYWlucygnKi5leGFtcGxlLmNvbScpO2AuPGJyIC8+XG4gICAqIFlvdSBjYW4gYWxzbyBzcGVjaWZ5IGEgcGF0aCBhbG9uZyBhIGRvbWFpbjogYHNldERvbWFpbnMoJyouZXhhbXBsZS5jb20vc3Vic2l0ZTEnKTtgLlxuICAgKlxuICAgKiBAcGFyYW0gZG9tYWlucyBMaXN0IG9mIGhvc3RuYW1lcyBvciBkb21haW5zLCB3aXRoIG9yIHdpdGhvdXQgcGF0aCwgdG8gYmUgdHJlYXRlZCBhcyBsb2NhbC5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2ZhcS9ob3ctdG8vZmFxXzIzNjU0L3xDcm9zcyBEb21haW4gTGlua2luZ31cbiAgICovXG4gIHNldERvbWFpbnMoZG9tYWluczogc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXREb21haW5zJywgZG9tYWlucyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIHRoZSBwYWdlJ3MgcmVwb3J0ZWQgVVJMLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFVSTCB0byBiZSByZXBvcnRlZCBmb3IgdGhlIHBhZ2UuXG4gICAqL1xuICBzZXRDdXN0b21VcmwodXJsOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRDdXN0b21VcmwnLCB1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIE92ZXJyaWRlcyB0aGUgZGV0ZWN0ZWQgSHR0cC1SZWZlcmVyLlxuICAgKiBNYXRvbW8gcmVjb21tZW5kcyB5b3UgY2FsbCB0aGlzIG1ldGhvZCBlYXJseSBpbiB5b3VyIHRyYWNraW5nIGNvZGUgYmVmb3JlIHlvdSBjYWxsIGB0cmFja1BhZ2VWaWV3YCBpZiBpdCBzaG91bGQgYmUgYXBwbGllZCB0byBhbGwgdHJhY2tpbmcgcmVxdWVzdHMuXG4gICAqXG4gICAqIEBwYXJhbSB1cmwgVVJMIHRvIGJlIHJlcG9ydGVkIGZvciB0aGUgcmVmZXJyZXIuXG4gICAqL1xuICBzZXRSZWZlcnJlclVybCh1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldFJlZmVycmVyVXJsJywgdXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBhcnJheSBvZiBob3N0bmFtZXMgb3IgZG9tYWlucyB0aGF0IHNob3VsZCBiZSBpZ25vcmVkIGFzIHJlZmVycmVycy5cbiAgICogRm9yIHdpbGRjYXJkIHN1YmRvbWFpbnMsIHlvdSBjYW4gdXNlOiBgJy5leGFtcGxlLmNvbSdgIG9yIGAnKi5leGFtcGxlLmNvbSdgLiBZb3UgY2FuIGFsc28gc3BlY2lmeSBhIHBhdGggYWxvbmcgYSBkb21haW46IHNldEV4Y2x1ZGVkUmVmZXJyZXJzKCcqLmV4YW1wbGUuY29tL3N1YnNpdGUxJyk7LlxuICAgKiBUaGlzIG1ldGhvZCBpcyBhdmFpbGFibGUgYXMgb2YgTWF0b21vIDQuMTIuXG4gICAqIEBwYXJhbSB1cmwgVVJMIG9yIGxpc3Qgb2YgVVJMXG4gICAqL1xuICBzZXRFeGNsdWRlZFJlZmVycmVycyh1cmw6IHN0cmluZyB8IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0RXhjbHVkZWRSZWZlcnJlcnMnLCB1cmwpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGxpc3Qgb2YgZXhjbHVkZWQgcmVmZXJyZXJzLCB3aGljaCB3YXMgcHJldmlvdXNseSBzZXQgdXNpbmcgYHNldEV4Y2x1ZGVkUmVmZXJyZXJzYC5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3RzIHJlcHJlc2VudHMgdGhlIGxpc3Qgb2YgZXhjbHVkZWQgcmVmZXJyZXJzLlxuICAgKi9cbiAgZ2V0RXhjbHVkZWRSZWZlcnJlcnMoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248c3RyaW5nW10+KCdnZXRFeGNsdWRlZFJlZmVycmVycycpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgd2Vic2l0ZSBJRC48YnIgLz5cbiAgICogUmVkdW5kYW50OiBjYW4gYmUgc3BlY2lmaWVkIGluIGdldFRyYWNrZXIoKSBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogVE9ETyBJbnZlc3RpZ2F0ZSBpZiBzZXRTaXRlSWQgbmVlZHMgdG8gYmUgcmVtb3ZlZCBmcm9tIE1hdG9tb1RyYWNrZXIuXG4gICAqIEBwYXJhbSBzaXRlSWQgU2l0ZSBJRCBmb3IgdGhlIHRyYWNrZXIuXG4gICAqL1xuICBzZXRTaXRlSWQoc2l0ZUlkOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRTaXRlSWQnLCBzaXRlSWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyB0aGUgTWF0b21vIEhUVFAgQVBJIFVSTCBlbmRwb2ludC48YnIgLz5cbiAgICogUG9pbnRzIHRvIHRoZSByb290IGRpcmVjdG9yeSBvZiBNYXRvbW8sIGUuZy4gaHR0cDovL21hdG9tby5leGFtcGxlLm9yZy8gb3IgaHR0cHM6Ly9leGFtcGxlLm9yZy9tYXRvbW8vLjxiciAvPlxuICAgKiBUaGlzIGZ1bmN0aW9uIGlzIG9ubHkgdXNlZnVsIHdoZW4gdGhlICdPdmVybGF5JyByZXBvcnQgaXMgbm90IHdvcmtpbmcuPGJyIC8+XG4gICAqIEJ5IGRlZmF1bHQsIHlvdSBkbyBub3QgbmVlZCB0byB1c2UgdGhpcyBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHVybCBVUkwgZm9yIE1hdG9tbyBIVFRQIEFQSSBlbmRwb2ludC5cbiAgICovXG4gIHNldEFwaVVybCh1cmw6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldEFwaVVybCcsIHVybCk7XG4gIH1cblxuICAvKipcbiAgICogU3BlY2lmaWVzIHRoZSBNYXRvbW8gc2VydmVyIFVSTC48YnIgLz5cbiAgICogUmVkdW5kYW50OiBjYW4gYmUgc3BlY2lmaWVkIGluIGdldFRyYWNrZXIoKSBjb25zdHJ1Y3Rvci5cbiAgICpcbiAgICogVE9ETyBJbnZlc3RpZ2F0ZSBpZiBzZXRUcmFja2VyVXJsIG5lZWRzIHRvIGJlIHJlbW92ZWQgZnJvbSBNYXRvbW9UcmFja2VyLlxuICAgKiBAcGFyYW0gdXJsIFVSTCBmb3IgdGhlIE1hdG9tbyBzZXJ2ZXIuXG4gICAqL1xuICBzZXRUcmFja2VyVXJsKHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0VHJhY2tlclVybCcsIHVybCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgTWF0b21vIHNlcnZlciBVUkwuXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgTWF0b21vIHNlcnZlciBVUkwuXG4gICAqL1xuICBnZXRNYXRvbW9VcmwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRNYXRvbW9VcmwnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHVybCBvZiB0aGUgcGFnZSB0aGF0IGlzIGN1cnJlbnRseSBiZWluZyB2aXNpdGVkLjxiciAvPlxuICAgKiBJZiBhIGN1c3RvbSBVUkwgd2FzIHNldCBiZWZvcmUgY2FsbGluZyB0aGlzIG1ldGhvZCwgdGhlIGN1c3RvbSBVUkwgd2lsbCBiZSByZXR1cm5lZC5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBVUkwgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAgICovXG4gIGdldEN1cnJlbnRVcmwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRDdXJyZW50VXJsJyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgdGhlIGJyb3dzZXIgZmVhdHVyZSBkZXRlY3Rpb24uPGJyIC8+XG4gICAqIEJ5IGRlZmF1bHQsIE1hdG9tbyBhY2Nlc3NlcyBpbmZvcm1hdGlvbiBmcm9tIHRoZSB2aXNpdG9yJ3MgYnJvd3NlciB0byBkZXRlY3QgdGhlIGN1cnJlbnQgYnJvd3NlciByZXNvbHV0aW9uIGFuZCB3aGF0IGJyb3dzZXIgcGx1Z2luc1xuICAgKiAoZm9yIGV4YW1wbGUgUERGIGFuZCBjb29raWVzKSBhcmUgc3VwcG9ydGVkLiBUaGlzIGluZm9ybWF0aW9uIGlzIHVzZWQgdG8gc2hvdyB5b3UgcmVwb3J0cyBvbiB5b3VyIHZpc2l0b3IncyBicm93c2VyIHJlc29sdXRpb24sIHN1cHBvcnRlZFxuICAgKiBicm93c2VyIHBsdWdpbnMsIGFuZCBpdCBpcyBhbHNvIHVzZWQgdG8gZ2VuZXJhdGUgYSBzaG9ydC1saXZlZCBpZGVudGlmaWVyIGZvciBldmVyeSB2aXNpdG9yIHdoaWNoIHdlIGNhbGwgdGhlIGNvbmZpZ19pZC48YnIgLz5cbiAgICogU29tZSBwcml2YWN5IHJlZ3VsYXRpb25zIG1heSBvbmx5IGFsbG93IGFjY2Vzc2luZyBpbmZvcm1hdGlvbiBmcm9tIGEgdmlzaXRvcidzIGRldmljZSBhZnRlciBoYXZpbmcgY29uc2VudC4gSWYgdGhpcyBhcHBsaWVzIHRvIHlvdSwgY2FsbFxuICAgKiB0aGlzIG1ldGhvZCB0byBubyBsb25nZXIgYWNjZXNzIHRoaXMgaW5mb3JtYXRpb24uXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9mYXEvaG93LWRvLWktZGlzYWJsZS1icm93c2VyLWZlYXR1cmUtZGV0ZWN0aW9uLWNvbXBsZXRlbHkvfEhvdyBkbyBJIGRpc2FibGUgYnJvd3NlciBmZWF0dXJlIGRldGVjdGlvbiBjb21wbGV0ZWx5P31cbiAgICovXG4gIGRpc2FibGVCcm93c2VyRmVhdHVyZURldGVjdGlvbigpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkaXNhYmxlQnJvd3NlckZlYXR1cmVEZXRlY3Rpb24nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSBicm93c2VyIGZlYXR1cmUgZGV0ZWN0aW9uIGlmIHlvdSBwcmV2aW91c2x5IGRpc2FibGVkIGl0LlxuICAgKi9cbiAgZW5hYmxlQnJvd3NlckZlYXR1cmVEZXRlY3Rpb24oKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZW5hYmxlQnJvd3NlckZlYXR1cmVEZXRlY3Rpb24nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGNsYXNzZXMgdG8gYmUgdHJlYXRlZCBhcyBkb3dubG9hZHMgKGluIGFkZGl0aW9uIHRvIHBpd2lrX2Rvd25sb2FkKS5cbiAgICpcbiAgICogQHBhcmFtIGNsYXNzZXMgQ2xhc3MsIG9yIGxpc3Qgb2YgY2xhc3NlcyB0byBiZSB0cmVhdGVkIGFzIGRvd25sb2Fkcy5cbiAgICovXG4gIHNldERvd25sb2FkQ2xhc3NlcyhjbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldERvd25sb2FkQ2xhc3NlcycsIGNsYXNzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZmlsZSBleHRlbnNpb25zIHRvIGJlIHJlY29nbml6ZWQgYXMgZG93bmxvYWRzLjxiciAvPlxuICAgKiBFeGFtcGxlOiBgJ2RvY3gnYCBvciBgWydkb2N4JywgJ3hsc3gnXWAuXG4gICAqXG4gICAqIEBwYXJhbSBleHRlbnNpb25zIEV4dGVuc2lvbiwgb3IgbGlzdCBvZiBleHRlbnNpb25zIHRvIGJlIHJlY29nbml6ZWQgYXMgZG93bmxvYWRzLlxuICAgKi9cbiAgc2V0RG93bmxvYWRFeHRlbnNpb25zKGV4dGVuc2lvbnM6IHN0cmluZyB8IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0RG93bmxvYWRDbGFzc2VzJywgZXh0ZW5zaW9ucyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhZGRpdGlvbmFsIGZpbGUgZXh0ZW5zaW9ucyB0byBiZSByZWNvZ25pemVkIGFzIGRvd25sb2Fkcy48YnIgLz5cbiAgICogRXhhbXBsZTogYCdkb2N4J2Agb3IgYFsnZG9jeCcsICd4bHN4J11gLlxuICAgKlxuICAgKiBAcGFyYW0gZXh0ZW5zaW9ucyBFeHRlbnNpb24sIG9yIGxpc3Qgb2YgZXh0ZW5zaW9ucyB0byBiZSByZWNvZ25pemVkIGFzIGRvd25sb2Fkcy5cbiAgICovXG4gIGFkZERvd25sb2FkRXh0ZW5zaW9ucyhleHRlbnNpb25zOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldERvd25sb2FkQ2xhc3NlcycsIGV4dGVuc2lvbnMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNwZWNpZmllcyBmaWxlIGV4dGVuc2lvbnMgdG8gYmUgcmVtb3ZlZCBmcm9tIHRoZSBsaXN0IG9mIGRvd25sb2FkIGZpbGUgZXh0ZW5zaW9ucy48YnIgLz5cbiAgICogRXhhbXBsZTogYCdkb2N4J2Agb3IgYFsnZG9jeCcsICd4bHN4J11gLlxuICAgKlxuICAgKiBAcGFyYW0gZXh0ZW5zaW9ucyBFeHRlbnNpb24sIG9yIGxpc3Qgb2YgZXh0ZW5zaW9ucyBub3QgdG8gYmUgcmVjb2duaXplZCBhcyBkb3dubG9hZHMuXG4gICAqL1xuICByZW1vdmVEb3dubG9hZEV4dGVuc2lvbnMoZXh0ZW5zaW9uczogc3RyaW5nIHwgc3RyaW5nW10pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXREb3dubG9hZENsYXNzZXMnLCBleHRlbnNpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGNsYXNzZXMgdG8gYmUgaWdub3JlZCBpZiBwcmVzZW50IGluIGxpbmsgKGluIGFkZGl0aW9uIHRvIHBpd2lrX2lnbm9yZSkuXG4gICAqXG4gICAqIEBwYXJhbSBjbGFzc2VzIENsYXNzLCBvciBsaXN0IG9mIGNsYXNzZXMgdG8gYmUgaWdub3JlZCBpZiBwcmVzZW50IGluIGxpbmsuXG4gICAqL1xuICBzZXRJZ25vcmVDbGFzc2VzKGNsYXNzZXM6IHN0cmluZyB8IHN0cmluZ1tdKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0RG93bmxvYWRDbGFzc2VzJywgY2xhc3Nlcyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBjbGFzc2VzIHRvIGJlIHRyZWF0ZWQgYXMgb3V0bGlua3MgKGluIGFkZGl0aW9uIHRvIHBpd2lrX2xpbmspLlxuICAgKlxuICAgKiBAcGFyYW0gY2xhc3NlcyBDbGFzcywgb3IgbGlzdCBvZiBjbGFzc2VzIHRvIGJlIHRyZWF0ZWQgYXMgb3V0bGlua3MuXG4gICAqL1xuICBzZXRMaW5rQ2xhc3NlcyhjbGFzc2VzOiBzdHJpbmcgfCBzdHJpbmdbXSk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldERvd25sb2FkQ2xhc3NlcycsIGNsYXNzZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgZGVsYXkgZm9yIGxpbmsgdHJhY2tpbmcgKGluIG1pbGxpc2Vjb25kcykuXG4gICAqXG4gICAqIEBwYXJhbSBkZWxheSBEZWxheSwgaW4gbWlsbGlzZWNvbmRzLCBmb3IgbGluayB0cmFja2luZy5cbiAgICovXG4gIHNldExpbmtUcmFja2luZ1RpbWVyKGRlbGF5OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRMaW5rVHJhY2tpbmdUaW1lcicsIGRlbGF5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGRlbGF5IGZvciBsaW5rIHRyYWNraW5nLlxuICAgKlxuICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGRlbGF5IGluIG1pbGxpc2Vjb25kcy5cbiAgICovXG4gIGdldExpbmtUcmFja2luZ1RpbWVyKCk6IFByb21pc2U8bnVtYmVyPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248bnVtYmVyPignZ2V0TGlua1RyYWNraW5nVGltZXInKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGlmIG9yIG5vdCB0byByZWNvcmQgdGhlIGhhc2ggdGFnIChhbmNob3IpIHBvcnRpb24gb2YgVVJMcy5cbiAgICpcbiAgICogQHBhcmFtIHZhbHVlIElmIHRydWUsIHRoZSBoYXNoIHRhZyBwb3J0aW9uIG9mIHRoZSBVUkxzIHdvbid0IGJlIHJlY29yZGVkLlxuICAgKi9cbiAgZGlzY2FyZEhhc2hUYWcodmFsdWU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkaXNjYXJkSGFzaFRhZycsIHZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBCeSBkZWZhdWx0IE1hdG9tbyB1c2VzIHRoZSBicm93c2VyIERPTSBUaW1pbmcgQVBJIHRvIGFjY3VyYXRlbHkgZGV0ZXJtaW5lIHRoZSB0aW1lIGl0IHRha2VzIHRvIGdlbmVyYXRlIGFuZCBkb3dubG9hZFxuICAgKiB0aGUgcGFnZS4gWW91IG1heSBvdmVyd3JpdGUgdGhpcyB2YWx1ZSB3aXRoIHRoaXMgZnVuY3Rpb24uXG4gICAqIFRoaXMgQVBJIGhhcyBiZWVuIGRlcHJlY2F0ZWQgaW4gTWF0b21vIDQueC5cbiAgICpcbiAgICogQHBhcmFtIGdlbmVyYXRpb25UaW1lIFRpbWUsIGluIG1pbGxpc2Vjb25kcywgb2YgdGhlIHBhZ2UgZ2VuZXJhdGlvbi5cbiAgICogQGRlcHJlY2F0ZWQgc2luY2UgdmVyc2lvbiAzLjAuXG4gICAqIEBzZWUge0BsaW5rIHNldFBhZ2VQZXJmb3JtYW5jZVRpbWluZ31cbiAgICovXG4gIHNldEdlbmVyYXRpb25UaW1lTXMoZ2VuZXJhdGlvblRpbWU6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldEdlbmVyYXRpb25UaW1lTXMnLCBnZW5lcmF0aW9uVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogQXBwZW5kcyBhIGN1c3RvbSBzdHJpbmcgdG8gdGhlIGVuZCBvZiB0aGUgSFRUUCByZXF1ZXN0IHRvIG1hdG9tby5waHAuXG4gICAqXG4gICAqIEBwYXJhbSBhcHBlbmRUb1VybCBTdHJpbmcgdG8gYXBwZW5kIHRvIHRoZSBlbmQgb2YgdGhlIEhUVFAgcmVxdWVzdCB0byBwaXdpay5waHAvbWF0b21vLnBocC5cbiAgICovXG4gIGFwcGVuZFRvVHJhY2tpbmdVcmwoYXBwZW5kVG9Vcmw6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ2FwcGVuZFRvVHJhY2tpbmdVcmwnLCBhcHBlbmRUb1VybCk7XG4gIH1cblxuICAvKipcbiAgICogRW5hYmxlcyBhIGZyYW1lLWJ1c3RlciB0byBwcmV2ZW50IHRoZSB0cmFja2VkIHdlYiBwYWdlIGZyb20gYmVpbmcgZnJhbWVkL2lmcmFtZWQuXG4gICAqL1xuICBraWxsRnJhbWUoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbigna2lsbEZyYW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogRm9yY2VzIHRoZSBicm93c2VyIHRvIGxvYWQgdGhlIGxpdmUgVVJMIGlmIHRoZSB0cmFja2VkIHdlYiBwYWdlIGlzIGxvYWRlZCBmcm9tIGEgbG9jYWwgZmlsZVxuICAgKiAoZS5nLiwgc2F2ZWQgdG8gc29tZW9uZSdzIGRlc2t0b3ApLlxuICAgKlxuICAgKiBAcGFyYW0gdXJsIFVSTCB0byB0cmFjayBpbnN0ZWFkIG9mIGBmaWxlOi8vYCBVUkxzLlxuICAgKi9cbiAgcmVkaXJlY3RGaWxlKHVybDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbigncmVkaXJlY3RGaWxlJywgdXJsKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSAxNiBjaGFyYWN0ZXJzIElEIGZvciB0aGUgdmlzaXRvci5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSAxNiBjaGFyYWN0ZXJzIElEIGZvciB0aGUgdmlzaXRvci5cbiAgICovXG4gIGdldFZpc2l0b3JJZCgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPHN0cmluZz4oJ2dldFZpc2l0b3JJZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIGB2aXNpdG9ySWRgLjxiciAvPlxuICAgKiBUaGUgdmlzaXRvcklkIHdvbid0IGJlIHBlcnNpc3RlZCBpbiBhIGNvb2tpZSBhbmQgbmVlZHMgdG8gYmUgc2V0IG9uIGV2ZXJ5IG5ldyBwYWdlIGxvYWQuXG4gICAqXG4gICAqICBAcGFyYW0gdmlzaXRvcklkIG5lZWRzIHRvIGJlIGEgMTYgZGlnaXQgaGV4IHN0cmluZy5cbiAgICovXG4gIHNldFZpc2l0b3JJZCh2aXNpdG9ySWQ6IHN0cmluZykge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldFZpc2l0b3JJZCcsIHZpc2l0b3JJZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgdmlzaXRvciBjb29raWUgY29udGVudHMgaW4gYW4gYXJyYXkuXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY29va2llIGNvbnRlbnRzIGluIGFuIGFycmF5LlxuICAgKi9cbiAgZ2V0VmlzaXRvckluZm8oKTogUHJvbWlzZTxzdHJpbmdbXT4ge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPHN0cmluZ1tdPignZ2V0VmlzaXRvckluZm8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSB2aXNpdG9yIGF0dHJpYnV0aW9uIGFycmF5IChSZWZlcmVyIGluZm9ybWF0aW9uIGFuZC9vciBDYW1wYWlnbiBuYW1lICYga2V5d29yZCkuPGJyIC8+XG4gICAqIEF0dHJpYnV0aW9uIGluZm9ybWF0aW9uIGlzIHVzZWQgYnkgTWF0b21vIHRvIGNyZWRpdCB0aGUgY29ycmVjdCByZWZlcnJlciAoZmlyc3Qgb3IgbGFzdCByZWZlcnJlcilcbiAgICogdXNlZCB3aGVuIGEgdXNlciB0cmlnZ2VycyBhIGdvYWwgY29udmVyc2lvbi5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSB2aXNpdG9yIGF0dHJpYnV0aW9uIGFycmF5IChSZWZlcmVyIGluZm9ybWF0aW9uIGFuZC9vciBDYW1wYWlnbiBuYW1lICYga2V5d29yZCkuXG4gICAqL1xuICBnZXRBdHRyaWJ1dGlvbkluZm8oKTogUHJvbWlzZTx1bmtub3duW10+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjx1bmtub3duW10+KCdnZXRBdHRyaWJ1dGlvbkluZm8nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBhdHRyaWJ1dGlvbiBjYW1wYWlnbiBuYW1lLlxuICAgKlxuICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGF0dHJpYnV0aW9uIGNhbXBhaWduIG5hbWUuXG4gICAqL1xuICBnZXRBdHRyaWJ1dGlvbkNhbXBhaWduTmFtZSgpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPHN0cmluZz4oJ2dldEF0dHJpYnV0aW9uQ2FtcGFpZ25OYW1lJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgYXR0cmlidXRpb24gY2FtcGFpZ24ga2V5d29yZC5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBhdHRyaWJ1dGlvbiBjYW1wYWlnbiBrZXl3b3JkLlxuICAgKi9cbiAgZ2V0QXR0cmlidXRpb25DYW1wYWlnbktleXdvcmQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRBdHRyaWJ1dGlvbkNhbXBhaWduS2V5d29yZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGF0dHJpYnV0aW9uIHJlZmVycmVyIHRpbWVzdGFtcC5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBhdHRyaWJ1dGlvbiByZWZlcnJlciB0aW1lc3RhbXAgKGFzIHN0cmluZykuXG4gICAqL1xuICBnZXRBdHRyaWJ1dGlvblJlZmVycmVyVGltZXN0YW1wKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248c3RyaW5nPignZ2V0QXR0cmlidXRpb25SZWZlcnJlclRpbWVzdGFtcCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGF0dHJpYnV0aW9uIHJlZmVycmVyIFVSTC5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBhdHRyaWJ1dGlvbiByZWZlcnJlciBVUkxcbiAgICovXG4gIGdldEF0dHJpYnV0aW9uUmVmZXJyZXJVcmwoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRBdHRyaWJ1dGlvblJlZmVycmVyVXJsJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgVXNlciBJRCBzdHJpbmcgaWYgaXQgd2FzIHNldC5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBVc2VyIElEIGZvciB0aGUgdmlzaXRvci5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvdXNlci1pZC98TWF0b21vIFVzZXIgSUR9XG4gICAqL1xuICBnZXRVc2VySWQoKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRVc2VySWQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGEgVXNlciBJRCB0byB0aGlzIHVzZXIgKHN1Y2ggYXMgYW4gZW1haWwgYWRkcmVzcyBvciBhIHVzZXJuYW1lKS5cbiAgICpcbiAgICogQHBhcmFtIHVzZXJJZCBVc2VyIElEIHRvIHNldCBmb3IgdGhlIGN1cnJlbnQgdmlzaXRvci5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvdXNlci1pZC98TWF0b21vIFVzZXIgSUR9XG4gICAqL1xuICBzZXRVc2VySWQodXNlcklkOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRVc2VySWQnLCB1c2VySWQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgVXNlciBJRCB3aGljaCBhbHNvIGdlbmVyYXRlcyBhIG5ldyBWaXNpdG9yIElELlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL21hdG9tby5vcmcvZG9jcy91c2VyLWlkL3xNYXRvbW8gVXNlciBJRH1cbiAgICovXG4gIHJlc2V0VXNlcklkKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3Jlc2V0VXNlcklkJyk7XG4gIH1cblxuICAvKipcbiAgICogT3ZlcnJpZGVzIFBhZ2VWaWV3IGlkIGZvciBldmVyeSB1c2Ugb2YgbG9nUGFnZVZpZXcoKS5cbiAgICogRG8gbm90IHVzZSB0aGlzIGlmIHlvdSBjYWxsIHRyYWNrUGFnZVZpZXcoKSBtdWx0aXBsZSB0aW1lcyBkdXJpbmcgdHJhY2tpbmcgKGUuZy4gd2hlbiB0cmFja2luZyBhIHNpbmdsZSBwYWdlIGFwcGxpY2F0aW9uKVxuICAgKlxuICAgKiBAcGFyYW0gcGFnZVZpZXdJZCBQYWdlVmlldyBpZCB0byB1c2UuXG4gICAqL1xuICBzZXRQYWdlVmlld0lkKHBhZ2VWaWV3SWQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldFBhZ2VWaWV3SWQnLCBwYWdlVmlld0lkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBQYWdlVmlldyBpZC5cbiAgICogSWYgbm90IHNldCBtYW51YWxseSB1c2luZyBzZXRQYWdlVmlld0lkLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0aGUgZHluYW1pYyBQYWdlVmlldyBpZCwgdXNlZCBpbiB0aGUgbGFzdCB0cmFja2VkIHBhZ2UgdmlldyxcbiAgICogb3IgdW5kZWZpbmVkIGlmIG5vIHBhZ2UgdmlldyB3YXMgdHJhY2tlZCB5ZXQuXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgUGFnZVZpZXcgaWQuXG4gICAqL1xuICBnZXRQYWdlVmlld0lkKCk6IFByb21pc2U8c3RyaW5nPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248c3RyaW5nPignZ2V0UGFnZVZpZXdJZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBjdXN0b20gdmFyaWFibGUuXG4gICAqXG4gICAqIEBwYXJhbSBpbmRleCBJbmRleCwgdGhlIG51bWJlciBmcm9tIDEgdG8gNSB3aGVyZSB0aGlzIGN1c3RvbSB2YXJpYWJsZSBuYW1lIGlzIHN0b3JlZCBmb3IgdGhlIGN1cnJlbnQgcGFnZSB2aWV3LlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lLCB0aGUgbmFtZSBvZiB0aGUgdmFyaWFibGUsIGZvciBleGFtcGxlOiBDYXRlZ29yeSwgU3ViLWNhdGVnb3J5LCBVc2VyVHlwZS5cbiAgICogQHBhcmFtIHZhbHVlIFZhbHVlLCBmb3IgZXhhbXBsZTogXCJTcG9ydHNcIiwgXCJOZXdzXCIsIFwiV29ybGRcIiwgXCJCdXNpbmVzc1wi4oCmXG4gICAqIEBwYXJhbSBzY29wZSBTY29wZSBvZiB0aGUgY3VzdG9tIHZhcmlhYmxlOjxiciAvPlxuICAgKiAtICdwYWdlJyBtZWFucyB0aGUgY3VzdG9tIHZhcmlhYmxlIGFwcGxpZXMgdG8gdGhlIGN1cnJlbnQgcGFnZSB2aWV3LlxuICAgKiAtICd2aXNpdCcgbWVhbnMgdGhlIGN1c3RvbSB2YXJpYWJsZSBhcHBsaWVzIHRvIHRoZSBjdXJyZW50IHZpc2l0b3IuXG4gICAqIC0gJ2V2ZW50JyBtZWFucyB0aGUgY3VzdG9tIHZhcmlhYmxlIGFwcGxpZXMgdG8gdGhlIGN1cnJlbnQgZXZlbnQuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2N1c3RvbS12YXJpYWJsZXMvfEN1c3RvbSBWYXJpYWJsZXN9XG4gICAqL1xuICBzZXRDdXN0b21WYXJpYWJsZShpbmRleDogbnVtYmVyLCBuYW1lOiBzdHJpbmcsIHZhbHVlOiBzdHJpbmcsIHNjb3BlOiBNYXRvbW9TY29wZSk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldEN1c3RvbVZhcmlhYmxlJywgaW5kZXgsIG5hbWUsIHZhbHVlLCBzY29wZSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhIGN1c3RvbSB2YXJpYWJsZS5cbiAgICpcbiAgICogQHBhcmFtIGluZGV4IEluZGV4IG9mIHRoZSBjdXN0b20gdmFyaWFibGUgdG8gZGVsZXRlLlxuICAgKiBAcGFyYW0gc2NvcGUgU2NvcGUgb2YgdGhlIGN1c3RvbSB2YXJpYWJsZSB0byBkZWxldGUuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL2N1c3RvbS12YXJpYWJsZXMvfEN1c3RvbSBWYXJpYWJsZXN9XG4gICAqL1xuICBkZWxldGVDdXN0b21WYXJpYWJsZShpbmRleDogbnVtYmVyLCBzY29wZTogTWF0b21vU2NvcGUpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkZWxldGVDdXN0b21WYXJpYWJsZScsIGluZGV4LCBzY29wZSk7XG4gIH1cblxuICAvKipcbiAgICogRGVsZXRlcyBhbGwgY3VzdG9tIHZhcmlhYmxlcy5cbiAgICpcbiAgICogQHBhcmFtIHNjb3BlIFNjb3BlIG9mIHRoZSBjdXN0b20gdmFyaWFibGVzIHRvIGRlbGV0ZS5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvY3VzdG9tLXZhcmlhYmxlcy98Q3VzdG9tIFZhcmlhYmxlc31cbiAgICovXG4gIGRlbGV0ZUN1c3RvbVZhcmlhYmxlcyhzY29wZTogTWF0b21vU2NvcGUpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkZWxldGVDdXN0b21WYXJpYWJsZXMnLCBzY29wZSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmVzIGEgY3VzdG9tIHZhcmlhYmxlLlxuICAgKlxuICAgKiBAcGFyYW0gaW5kZXggSW5kZXggb2YgdGhlIGN1c3RvbSB2YXJpYWJsZSB0byByZXRyaWV2ZS5cbiAgICogQHBhcmFtIHNjb3BlIFNjb3BlIG9mIHRoZSBjdXN0b20gdmFyaWFibGUgdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgdmFsdWUgb2YgY3VzdG9tIHZhcmlhYmxlLlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL21hdG9tby5vcmcvZG9jcy9jdXN0b20tdmFyaWFibGVzL3xDdXN0b20gVmFyaWFibGVzfVxuICAgKi9cbiAgZ2V0Q3VzdG9tVmFyaWFibGUoaW5kZXg6IG51bWJlciwgc2NvcGU6IE1hdG9tb1Njb3BlKTogUHJvbWlzZTxzdHJpbmc+IHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRDdXN0b21WYXJpYWJsZScsIGluZGV4LCBzY29wZSk7XG4gIH1cblxuICAvKipcbiAgICogV2hlbiBjYWxsZWQgdGhlbiB0aGUgQ3VzdG9tIFZhcmlhYmxlcyBvZiBzY29wZSAndmlzaXQnIHdpbGwgYmUgc3RvcmVkIChwZXJzaXN0ZWQpIGluIGEgZmlyc3QgcGFydHkgY29va2llXG4gICAqIGZvciB0aGUgZHVyYXRpb24gb2YgdGhlIHZpc2l0LjxiciAvPlxuICAgKiBUaGlzIGlzIHVzZWZ1bCBpZiB5b3Ugd2FudCB0byBjYWxsIGBnZXRDdXN0b21WYXJpYWJsZWAgbGF0ZXIgaW4gdGhlIHZpc2l0LjxiciAvPlxuICAgKiAoYnkgZGVmYXVsdCBjdXN0b20gdmFyaWFibGVzIGFyZSBub3Qgc3RvcmVkIG9uIHRoZSB2aXNpdG9yJ3MgY29tcHV0ZXIuKVxuICAgKlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL21hdG9tby5vcmcvZG9jcy9jdXN0b20tdmFyaWFibGVzL3xDdXN0b20gVmFyaWFibGVzfVxuICAgKi9cbiAgc3RvcmVDdXN0b21WYXJpYWJsZXNJbkNvb2tpZSgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzdG9yZUN1c3RvbVZhcmlhYmxlc0luQ29va2llJyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBhIGN1c3RvbSBkaW1lbnNpb24uPGJyIC8+XG4gICAqIChyZXF1aXJlcyBDdXN0b20gRGltZW5zaW9ucyBwbHVnaW4pXG4gICAqXG4gICAqIEBwYXJhbSBjdXN0b21EaW1lbnNpb25JZCBJRCBvZiB0aGUgY3VzdG9tIGRpbWVuc2lvbiB0byBzZXQuXG4gICAqIEBwYXJhbSBjdXN0b21EaW1lbnNpb25WYWx1ZSBWYWx1ZSB0byBiZSBzZXQuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vcGx1Z2lucy5waXdpay5vcmcvQ3VzdG9tRGltZW5zaW9uc3xDdXN0b20gRGltZW5zaW9uc31cbiAgICovXG4gIHNldEN1c3RvbURpbWVuc2lvbihjdXN0b21EaW1lbnNpb25JZDogbnVtYmVyLCBjdXN0b21EaW1lbnNpb25WYWx1ZTogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0Q3VzdG9tRGltZW5zaW9uJywgY3VzdG9tRGltZW5zaW9uSWQsIGN1c3RvbURpbWVuc2lvblZhbHVlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWxldGVzIGEgY3VzdG9tIGRpbWVuc2lvbi48YnIgLz5cbiAgICogKHJlcXVpcmVzIEN1c3RvbSBEaW1lbnNpb25zIHBsdWdpbilcbiAgICpcbiAgICogQHBhcmFtIGN1c3RvbURpbWVuc2lvbklkIElEIG9mIHRoZSBjdXN0b20gZGltZW5zaW9uIHRvIGRlbGV0ZS5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9wbHVnaW5zLnBpd2lrLm9yZy9DdXN0b21EaW1lbnNpb25zfEN1c3RvbSBEaW1lbnNpb25zfVxuICAgKi9cbiAgZGVsZXRlQ3VzdG9tRGltZW5zaW9uKGN1c3RvbURpbWVuc2lvbklkOiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkZWxldGVDdXN0b21EaW1lbnNpb24nLCBjdXN0b21EaW1lbnNpb25JZCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0cmlldmUgYSBjdXN0b20gZGltZW5zaW9uLjxiciAvPlxuICAgKiAocmVxdWlyZXMgQ3VzdG9tIERpbWVuc2lvbnMgcGx1Z2luKVxuICAgKlxuICAgKiBAcGFyYW0gY3VzdG9tRGltZW5zaW9uSWQgSUQgb2YgdGhlIGN1c3RvbSBkaW1lbnNpb24gdG8gcmV0cmlldmUuXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgdmFsdWUgZm9yIHRoZSByZXF1ZXN0ZWQgY3VzdG9tIGRpbWVuc2lvbi5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9wbHVnaW5zLnBpd2lrLm9yZy9DdXN0b21EaW1lbnNpb25zfEN1c3RvbSBEaW1lbnNpb25zfVxuICAgKi9cbiAgZ2V0Q3VzdG9tRGltZW5zaW9uKGN1c3RvbURpbWVuc2lvbklkOiBudW1iZXIpOiBQcm9taXNlPHN0cmluZz4ge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPHN0cmluZz4oJ2dldEN1c3RvbURpbWVuc2lvbicsIGN1c3RvbURpbWVuc2lvbklkKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGNhbXBhaWduIG5hbWUgcGFyYW1ldGVyKHMpLlxuICAgKlxuICAgKiBAcGFyYW0gbmFtZSBOYW1lIG9mIHRoZSBjYW1wYWlnblxuICAgKiBAc2VlIHtAbGluayBodHRwczovL21hdG9tby5vcmcvZG9jcy90cmFja2luZy1jYW1wYWlnbnMvfENhbXBhaWduc31cbiAgICovXG4gIHNldENhbXBhaWduTmFtZUtleShuYW1lOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRDYW1wYWlnbk5hbWVLZXknLCBuYW1lKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIGNhbXBhaWduIGtleXdvcmQgcGFyYW1ldGVyKHMpLlxuICAgKlxuICAgKiBAcGFyYW0ga2V5d29yZCBLZXl3b3JkIHBhcmFtZXRlcihzKSBvZiB0aGUgY2FtcGFpZ24uXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9kb2NzL3RyYWNraW5nLWNhbXBhaWducy98Q2FtcGFpZ25zfVxuICAgKi9cbiAgc2V0Q2FtcGFpZ25LZXl3b3JkS2V5KGtleXdvcmQ6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldENhbXBhaWduS2V5d29yZEtleScsIGtleXdvcmQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgb3Igbm90IHRvIGF0dHJpYnV0ZSBhIGNvbnZlcnNpb24gdG8gdGhlIGZpcnN0IHJlZmVycmVyLjxiciAvPlxuICAgKiBCeSBkZWZhdWx0LCBjb252ZXJzaW9uIGlzIGF0dHJpYnV0ZWQgdG8gdGhlIG1vc3QgcmVjZW50IHJlZmVycmVyLlxuICAgKlxuICAgKiBAcGFyYW0gY29udmVyc2lvblRvRmlyc3RSZWZlcnJlciBJZiB0cnVlLCBNYXRvbW8gd2lsbCBhdHRyaWJ1dGUgdGhlIEdvYWwgY29udmVyc2lvbiB0byB0aGUgZmlyc3QgcmVmZXJyZXIgdXNlZFxuICAgKiBpbnN0ZWFkIG9mIHRoZSBsYXN0IG9uZS5cbiAgICogQHNlZSB7QGxpbmsgaHR0cHM6Ly9tYXRvbW8ub3JnL2RvY3MvdHJhY2tpbmctY2FtcGFpZ25zL3xDYW1wYWlnbnN9XG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vbWF0b21vLm9yZy9mYXEvZ2VuZXJhbC9mYXFfMTA2LyNmYXFfMTA2fENvbnZlcnNpb25zIHRvIHRoZSBmaXJzdCByZWZlcnJlcn1cbiAgICovXG4gIHNldENvbnZlcnNpb25BdHRyaWJ1dGlvbkZpcnN0UmVmZXJyZXIoY29udmVyc2lvblRvRmlyc3RSZWZlcnJlcjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldENvbnZlcnNpb25BdHRyaWJ1dGlvbkZpcnN0UmVmZXJyZXInLCBjb252ZXJzaW9uVG9GaXJzdFJlZmVycmVyKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHBhZ2UgdmlldyBhcyBhIHByb2R1Y3Qgb3IgY2F0ZWdvcnkgcGFnZSB2aWV3LjxiciAvPlxuICAgKiBXaGVuIHlvdSBjYWxsIHNldEVjb21tZXJjZVZpZXcsIGl0IG11c3QgYmUgZm9sbG93ZWQgYnkgYSBjYWxsIHRvIHRyYWNrUGFnZVZpZXcgdG8gcmVjb3JkIHRoZSBwcm9kdWN0IG9yIGNhdGVnb3J5IHBhZ2Ugdmlldy5cbiAgICpcbiAgICogQHBhcmFtIHByb2R1Y3RTS1UgU0tVIG9mIHRoZSB2aWV3ZWQgcHJvZHVjdC5cbiAgICogQHBhcmFtIHByb2R1Y3ROYW1lIE5hbWUgb2YgdGhlIHZpZXdlZCBwcm9kdWN0LlxuICAgKiBAcGFyYW0gcHJvZHVjdENhdGVnb3J5IENhdGVnb3J5IG9mIHRoZSB2aWV3ZWQgcHJvZHVjdC5cbiAgICogQHBhcmFtIHByaWNlIFByaWNlIG9mIHRoZSB2aWV3ZWQgcHJvZHVjdC5cbiAgICovXG4gIHNldEVjb21tZXJjZVZpZXcoXG4gICAgcHJvZHVjdFNLVTogc3RyaW5nLFxuICAgIHByb2R1Y3ROYW1lOiBzdHJpbmcsXG4gICAgcHJvZHVjdENhdGVnb3J5OiBzdHJpbmcsXG4gICAgcHJpY2U6IG51bWJlcixcbiAgKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0RWNvbW1lcmNlVmlldycsIHByb2R1Y3RTS1UsIHByb2R1Y3ROYW1lLCBwcm9kdWN0Q2F0ZWdvcnksIHByaWNlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgcHJvZHVjdCBpbnRvIHRoZSBlQ29tbWVyY2Ugb3JkZXIuPGJyIC8+XG4gICAqIE11c3QgYmUgY2FsbGVkIGZvciBlYWNoIHByb2R1Y3QgaW4gdGhlIG9yZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvZHVjdFNLVSBTS1Ugb2YgdGhlIHByb2R1Y3QgdG8gYWRkLlxuICAgKiBAcGFyYW0gW3Byb2R1Y3ROYW1lXSBPcHRpb25hbCBuYW1lIG9mIHRoZSBwcm9kdWN0IHRvIGFkZC5cbiAgICogQHBhcmFtIFtwcm9kdWN0Q2F0ZWdvcnldIE9wdGlvbmFsIGNhdGVnb3J5IG9mIHRoZSBwcm9kdWN0IHRvIGFkZC5cbiAgICogQHBhcmFtIFtwcmljZV0gT3B0aW9uYWwgcHJpY2Ugb2YgdGhlIHByb2R1Y3QgdG8gYWRkLlxuICAgKiBAcGFyYW0gW3F1YW50aXR5XSBPcHRpb25hbCBxdWFudGl0eSBvZiB0aGUgcHJvZHVjdCB0byBhZGQuXG4gICAqL1xuICBhZGRFY29tbWVyY2VJdGVtKFxuICAgIHByb2R1Y3RTS1U6IHN0cmluZyxcbiAgICBwcm9kdWN0TmFtZT86IHN0cmluZyxcbiAgICBwcm9kdWN0Q2F0ZWdvcnk/OiBzdHJpbmcsXG4gICAgcHJpY2U/OiBudW1iZXIsXG4gICAgcXVhbnRpdHk/OiBudW1iZXIsXG4gICk6IHZvaWQge1xuICAgIGNvbnN0IGFyZ3M6IHVua25vd25bXSA9IFtwcm9kdWN0U0tVXTtcbiAgICBpZiAocHJvZHVjdE5hbWUpIHtcbiAgICAgIGFyZ3MucHVzaChwcm9kdWN0TmFtZSk7XG4gICAgICBpZiAocHJvZHVjdENhdGVnb3J5KSB7XG4gICAgICAgIGFyZ3MucHVzaChwcm9kdWN0Q2F0ZWdvcnkpO1xuICAgICAgICBpZiAodHlwZW9mIHByaWNlID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGFyZ3MucHVzaChwcmljZSk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBxdWFudGl0eSA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChxdWFudGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ2FkZEVjb21tZXJjZUl0ZW0nLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmVzIHRoZSBzcGVjaWZpZWQgcHJvZHVjdCBmcm9tIHRoZSB1bnRyYWNrZWQgZWNvbW1lcmNlIG9yZGVyLlxuICAgKlxuICAgKiBAcGFyYW0gcHJvZHVjdFNLVSBTS1Ugb2YgdGhlIHByb2R1Y3QgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlRWNvbW1lcmNlSXRlbShwcm9kdWN0U0tVOiBzdHJpbmcpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdyZW1vdmVFY29tbWVyY2VJdGVtJywgcHJvZHVjdFNLVSk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhbGwgcHJvZHVjdHMgaW4gdGhlIHVudHJhY2tlZCBlY29tbWVyY2Ugb3JkZXIuPGJyIC8+XG4gICAqIE5vdGU6IHRoaXMgaXMgZG9uZSBhdXRvbWF0aWNhbGx5IGFmdGVyIGB0cmFja0Vjb21tZXJjZU9yZGVyKClgIGlzIGNhbGxlZC5cbiAgICovXG4gIGNsZWFyRWNvbW1lcmNlQ2FydCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdjbGVhckVjb21tZXJjZUNhcnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFsbCBlY29tbWVyY2UgaXRlbXMgY3VycmVudGx5IGluIHRoZSB1bnRyYWNrZWQgZWNvbW1lcmNlIG9yZGVyLlxuICAgKiBUaGUgcmV0dXJuZWQgYXJyYXkgd2lsbCBiZSBhIGNvcHksIHNvIGNoYW5naW5nIGl0IHdvbid0IGFmZmVjdCB0aGUgZWNvbW1lcmNlIG9yZGVyLjxiciAvPlxuICAgKiBUbyBhZmZlY3Qgd2hhdCBnZXRzIHRyYWNrZWQsIHVzZSB0aGUgYGFkZEVjb21tZXJjZUl0ZW0oKWAvYHJlbW92ZUVjb21tZXJjZUl0ZW0oKWAvYGNsZWFyRWNvbW1lcmNlQ2FydCgpYCBtZXRob2RzLjxiciAvPlxuICAgKiBVc2UgdGhpcyBtZXRob2QgdG8gc2VlIHdoYXQgd2lsbCBiZSB0cmFja2VkIGJlZm9yZSB5b3UgdHJhY2sgYW4gb3JkZXIgb3IgY2FydCB1cGRhdGUuXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgbGlzdCBvZiBpdGVtcyBpbiB0aGUgY3VycmVudCB1bnRyYWNrZWQgb3JkZXIuXG4gICAqL1xuICBnZXRFY29tbWVyY2VJdGVtcygpOiBQcm9taXNlPFxuICAgIHtcbiAgICAgIHByb2R1Y3RTS1U6IHN0cmluZztcbiAgICAgIHByb2R1Y3ROYW1lPzogc3RyaW5nO1xuICAgICAgcHJvZHVjdENhdGVnb3J5Pzogc3RyaW5nO1xuICAgICAgcHJpY2U/OiBudW1iZXI7XG4gICAgICBxdWFudGl0eT86IG51bWJlcjtcbiAgICB9W11cbiAgPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248XG4gICAgICB7XG4gICAgICAgIHByb2R1Y3RTS1U6IHN0cmluZztcbiAgICAgICAgcHJvZHVjdE5hbWU/OiBzdHJpbmc7XG4gICAgICAgIHByb2R1Y3RDYXRlZ29yeT86IHN0cmluZztcbiAgICAgICAgcHJpY2U/OiBudW1iZXI7XG4gICAgICAgIHF1YW50aXR5PzogbnVtYmVyO1xuICAgICAgfVtdXG4gICAgPignZ2V0RWNvbW1lcmNlSXRlbXMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUcmFja3MgYSBzaG9wcGluZyBjYXJ0LjxiciAvPlxuICAgKiBDYWxsIHRoaXMgZnVuY3Rpb24gZXZlcnkgdGltZSBhIHVzZXIgaXMgYWRkaW5nLCB1cGRhdGluZyBvciBkZWxldGluZyBhIHByb2R1Y3QgZnJvbSB0aGUgY2FydC5cbiAgICpcbiAgICogQHBhcmFtIGdyYW5kVG90YWwgR3JhbmQgdG90YWwgb2YgdGhlIHNob3BwaW5nIGNhcnQuXG4gICAqL1xuICB0cmFja0Vjb21tZXJjZUNhcnRVcGRhdGUoZ3JhbmRUb3RhbDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbigndHJhY2tFY29tbWVyY2VDYXJ0VXBkYXRlJywgZ3JhbmRUb3RhbCk7XG4gIH1cblxuICAvKipcbiAgICogVHJhY2tzIGFuIEVjb21tZXJjZSBvcmRlciwgaW5jbHVkaW5nIGFueSBlQ29tbWVyY2UgaXRlbSBwcmV2aW91c2x5IGFkZGVkIHRvIHRoZSBvcmRlci48YnIgLz5cbiAgICogb3JkZXJJZCBhbmQgZ3JhbmRUb3RhbCAoaWUucmV2ZW51ZSkgYXJlIHJlcXVpcmVkIHBhcmFtZXRlcnMuXG4gICAqXG4gICAqIEBwYXJhbSBvcmRlcklkIElEIG9mIHRoZSB0cmFja2VkIG9yZGVyLlxuICAgKiBAcGFyYW0gZ3JhbmRUb3RhbCBHcmFuZCB0b3RhbCBvZiB0aGUgdHJhY2tlZCBvcmRlci5cbiAgICogQHBhcmFtIFtzdWJUb3RhbF0gU3ViIHRvdGFsIG9mIHRoZSB0cmFja2VkIG9yZGVyLlxuICAgKiBAcGFyYW0gW3RheF0gVGF4ZXMgZm9yIHRoZSB0cmFja2VkIG9yZGVyLlxuICAgKiBAcGFyYW0gW3NoaXBwaW5nXSBTaGlwcGluZyBmZWVzIGZvciB0aGUgdHJhY2tlZCBvcmRlci5cbiAgICogQHBhcmFtIFtkaXNjb3VudF0gRGlzY291bnQgZ3JhbnRlZCBmb3IgdGhlIHRyYWNrZWQgb3JkZXIuXG4gICAqL1xuICB0cmFja0Vjb21tZXJjZU9yZGVyKFxuICAgIG9yZGVySWQ6IHN0cmluZyxcbiAgICBncmFuZFRvdGFsOiBudW1iZXIsXG4gICAgc3ViVG90YWw/OiBudW1iZXIsXG4gICAgdGF4PzogbnVtYmVyLFxuICAgIHNoaXBwaW5nPzogbnVtYmVyLFxuICAgIGRpc2NvdW50PzogbnVtYmVyIHwgYm9vbGVhbixcbiAgKTogdm9pZCB7XG4gICAgY29uc3QgYXJnczogdW5rbm93bltdID0gW29yZGVySWQsIGdyYW5kVG90YWxdO1xuICAgIGlmICh0eXBlb2Ygc3ViVG90YWwgPT09ICdudW1iZXInKSB7XG4gICAgICBhcmdzLnB1c2goc3ViVG90YWwpO1xuICAgICAgaWYgKHR5cGVvZiB0YXggPT09ICdudW1iZXInKSB7XG4gICAgICAgIGFyZ3MucHVzaCh0YXgpO1xuICAgICAgICBpZiAodHlwZW9mIHNoaXBwaW5nID09PSAnbnVtYmVyJykge1xuICAgICAgICAgIGFyZ3MucHVzaChzaGlwcGluZyk7XG4gICAgICAgICAgaWYgKHR5cGVvZiBkaXNjb3VudCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGRpc2NvdW50ID09PSAnYm9vbGVhbicpIHtcbiAgICAgICAgICAgIGFyZ3MucHVzaChkaXNjb3VudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3RyYWNrRWNvbW1lcmNlT3JkZXInLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRydWUgb3IgZmFsc2UgZGVwZW5kaW5nIG9uIHdoZXRoZXIgcmVxdWlyZUNvbnNlbnQgd2FzIGNhbGxlZCBwcmV2aW91c2x5LlxuICAgKlxuICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgc3RhdHVzIGZvciBjb25zZW50IHJlcXVpcmVtZW50LlxuICAgKi9cbiAgaXNDb25zZW50UmVxdWlyZWQoKTogUHJvbWlzZTxib29sZWFuPiB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248Ym9vbGVhbj4oJ2lzQ29uc2VudFJlcXVpcmVkJyk7XG4gIH1cblxuICAvKipcbiAgICogQnkgZGVmYXVsdCB0aGUgTWF0b21vIHRyYWNrZXIgYXNzdW1lcyBjb25zZW50IHRvIHRyYWNraW5nLlxuICAgKiBUbyBjaGFuZ2UgdGhpcyBiZWhhdmlvciBzbyBub3RoaW5nIGlzIHRyYWNrZWQgdW50aWwgYSB1c2VyIGNvbnNlbnRzLCB5b3UgbXVzdCBjYWxsIGByZXF1aXJlQ29uc2VudGAuXG4gICAqL1xuICByZXF1aXJlQ29uc2VudCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdyZXF1aXJlQ29uc2VudCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlcXVpcmUgdXNlciBjb29raWUgY29uc2VudCBiZWZvcmUgc3RvcmluZyBhbmQgdXNpbmcgYW55IGNvb2tpZXMuXG4gICAqL1xuICByZXF1aXJlQ29va2llQ29uc2VudCgpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdyZXF1aXJlQ29va2llQ29uc2VudCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBoYXMgY29uc2VudGVkLjxiciAvPlxuICAgKiBUaGUgY29uc2VudCBpcyBvbmUtdGltZSBvbmx5LCBzbyBpbiBhIHN1YnNlcXVlbnQgYnJvd3NlciBzZXNzaW9uLCB0aGUgdXNlciB3aWxsIGhhdmUgdG8gY29uc2VudCBhZ2Fpbi48YnIgLz5cbiAgICogVG8gcmVtZW1iZXIgY29uc2VudCwgc2VlIHRoZSBtZXRob2QgYmVsb3c6IGByZW1lbWJlckNvbnNlbnRHaXZlbmAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIHJlbWVtYmVyQ29uc2VudEdpdmVufVxuICAgKi9cbiAgc2V0Q29uc2VudEdpdmVuKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldENvbnNlbnRHaXZlbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBoYXMgY29uc2VudGVkIHRvIHN0b3JlIGFuZCB1c2UgY29va2llcy48YnIgLz5cbiAgICogVGhlIGNvbnNlbnQgaXMgb25lLXRpbWUgb25seSwgc28gaW4gYSBzdWJzZXF1ZW50IGJyb3dzZXIgc2Vzc2lvbiwgdGhlIHVzZXIgd2lsbCBoYXZlIHRvIGNvbnNlbnQgYWdhaW4uPGJyIC8+XG4gICAqIFRvIHJlbWVtYmVyIGNvbnNlbnQsIHNlZSB0aGUgbWV0aG9kIGJlbG93OiBgcmVtZW1iZXJDb29raWVDb25zZW50R2l2ZW5gLlxuICAgKi9cbiAgc2V0Q29va2llQ29uc2VudEdpdmVuKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldENvb2tpZUNvbnNlbnRHaXZlbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hcmtzIHRoYXQgdGhlIGN1cnJlbnQgdXNlciBoYXMgY29uc2VudGVkLCBhbmQgcmVtZW1iZXJzIHRoaXMgY29uc2VudCB0aHJvdWdoIGEgYnJvd3NlciBjb29raWUuPGJyIC8+XG4gICAqIFRoZSBuZXh0IHRpbWUgdGhlIHVzZXIgdmlzaXRzIHRoZSBzaXRlLCBNYXRvbW8gd2lsbCByZW1lbWJlciB0aGF0IHRoZXkgY29uc2VudGVkLCBhbmQgdHJhY2sgdGhlbS48YnIgLz5cbiAgICogSWYgeW91IGNhbGwgdGhpcyBtZXRob2QsIHlvdSBkbyBub3QgbmVlZCB0byBjYWxsIGBzZXRDb25zZW50R2l2ZW5gLlxuICAgKlxuICAgKiBAcGFyYW0gaG91cnNUb0V4cGlyZSBFeHBpcnkgcGVyaW9kIGZvciB5b3VyIHVzZXIgY29uc2VudC5cbiAgICovXG4gIHJlbWVtYmVyQ29uc2VudEdpdmVuKGhvdXJzVG9FeHBpcmU/OiBudW1iZXIpOiB2b2lkIHtcbiAgICBjb25zdCBhcmdzOiBudW1iZXJbXSA9IFtdO1xuICAgIGlmICh0eXBlb2YgaG91cnNUb0V4cGlyZSA9PT0gJ251bWJlcicpIHtcbiAgICAgIGFyZ3MucHVzaChob3Vyc1RvRXhwaXJlKTtcbiAgICB9XG4gICAgdGhpcy5zZXRGdW5jdGlvbigncmVtZW1iZXJDb25zZW50R2l2ZW4nLCAuLi5hcmdzKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNYXJrcyB0aGF0IHRoZSBjdXJyZW50IHVzZXIgaGFzIGNvbnNlbnRlZCwgYW5kIHJlbWVtYmVycyB0aGlzIGNvbnNlbnQgdGhyb3VnaCBhIGJyb3dzZXIgY29va2llLjxiciAvPlxuICAgKiBUaGUgbmV4dCB0aW1lIHRoZSB1c2VyIHZpc2l0cyB0aGUgc2l0ZSwgTWF0b21vIHdpbGwgcmVtZW1iZXIgdGhhdCB0aGV5IGNvbnNlbnRlZCwgYW5kIHRyYWNrIHRoZW0uPGJyIC8+XG4gICAqIElmIHlvdSBjYWxsIHRoaXMgbWV0aG9kLCB5b3UgZG8gbm90IG5lZWQgdG8gY2FsbCBgc2V0Q29va2llQ29uc2VudEdpdmVuYC5cbiAgICpcbiAgICogQHBhcmFtIGhvdXJzVG9FeHBpcmUgRXhwaXJ5IHBlcmlvZCBmb3IgeW91ciB1c2VyIGNvbnNlbnQuXG4gICAqL1xuICByZW1lbWJlckNvb2tpZUNvbnNlbnRHaXZlbihob3Vyc1RvRXhwaXJlPzogbnVtYmVyKTogdm9pZCB7XG4gICAgY29uc3QgYXJnczogbnVtYmVyW10gPSBbXTtcbiAgICBpZiAodHlwZW9mIGhvdXJzVG9FeHBpcmUgPT09ICdudW1iZXInKSB7XG4gICAgICBhcmdzLnB1c2goaG91cnNUb0V4cGlyZSk7XG4gICAgfVxuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3JlbWVtYmVyQ29va2llQ29uc2VudEdpdmVuJywgLi4uYXJncyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHVzZXIncyBjb25zZW50LCBib3RoIGlmIHRoZSBjb25zZW50IHdhcyBvbmUtdGltZSBvbmx5IGFuZCBpZiB0aGUgY29uc2VudCB3YXMgcmVtZW1iZXJlZC48YnIgLz5cbiAgICogVGhpcyBtYWtlcyBzdXJlIHRoZSBjb29raWUgdGhhdCByZW1lbWJlcmVkIHRoZSBnaXZlbiBjb25zZW50IGlzIGRlbGV0ZWQuPGJyIC8+XG4gICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHRoZSB1c2VyIHdpbGwgaGF2ZSB0byBjb25zZW50IGFnYWluIGluIG9yZGVyIHRvIGJlIHRyYWNrZWQuXG4gICAqL1xuICBmb3JnZXRDb25zZW50R2l2ZW4oKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZm9yZ2V0Q29uc2VudEdpdmVuJyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlcyBhIHVzZXIncyBjb25zZW50LCBib3RoIGlmIHRoZSBjb25zZW50IHdhcyBvbmUtdGltZSBvbmx5IGFuZCBpZiB0aGUgY29uc2VudCB3YXMgcmVtZW1iZXJlZC48YnIgLz5cbiAgICogVGhpcyBtYWtlcyBzdXJlIHRoZSBjb29raWUgdGhhdCByZW1lbWJlcmVkIHRoZSBnaXZlbiBjb25zZW50IGlzIGRlbGV0ZWQuPGJyIC8+XG4gICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QsIHRoZSB1c2VyIHdpbGwgaGF2ZSB0byBjb25zZW50IGFnYWluIGluIG9yZGVyIHRvIGJlIHRyYWNrZWQuXG4gICAqL1xuICBmb3JnZXRDb29raWVDb25zZW50R2l2ZW4oKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZm9yZ2V0Q29va2llQ29uc2VudEdpdmVuJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIHRoZSBjdXJyZW50IHZpc2l0b3IgaGFzIGdpdmVuIGNvbnNlbnQgcHJldmlvdXNseSBvciBub3QuXG4gICAqXG4gICAqIEByZXR1cm5zIFByb21pc2Ugb2JqZWN0IHJlcHJlc2VudGluZyB3aGV0aGVyIGNvbnNlbnQgaGFzIGJlZW4gcmVtZW1iZXJlZCBvciBub3QuXG4gICAqL1xuICBoYXNSZW1lbWJlcmVkQ29uc2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxib29sZWFuPignaGFzUmVtZW1iZXJlZENvbnNlbnQnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBJZiBjb25zZW50IHdhcyBnaXZlbiwgcmV0dXJucyB0aGUgdGltZXN0YW1wIHdoZW4gdGhlIHZpc2l0b3IgZ2F2ZSBjb25zZW50LjxiciAvPlxuICAgKiBPbmx5IHdvcmtzIGlmIGByZW1lbWJlckNvbnNlbnRHaXZlbmAgd2FzIHVzZWQgYW5kIG5vdCB3aGVuIGBzZXRDb25zZW50R2l2ZW5gIHdhcyB1c2VkLlxuICAgKiBUaGUgdGltZXN0YW1wIGlzIHRoZSBsb2NhbCB0aW1lc3RhbXAgd2hpY2ggZGVwZW5kcyBvbiB0aGUgdmlzaXRvcnMgdGltZS5cbiAgICpcbiAgICogQHJldHVybiBQcm9taXNlIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIHRpbWVzdGFtcCB3aGVuIGNvbnNlbnQgd2FzIHJlbWVtYmVyZWQuXG4gICAqL1xuICBnZXRSZW1lbWJlcmVkQ29uc2VudCgpIHtcbiAgICByZXR1cm4gdGhpcy5nZXRGdW5jdGlvbjxzdHJpbmc+KCdnZXRSZW1lbWJlcmVkQ29uc2VudCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIElmIGNvb2tpZSBjb25zZW50IHdhcyBnaXZlbiwgcmV0dXJucyB0aGUgdGltZXN0YW1wIHdoZW4gdGhlIHZpc2l0b3IgZ2F2ZSBjb25zZW50LjxiciAvPlxuICAgKiBPbmx5IHdvcmtzIGlmIGByZW1lbWJlckNvb2tpZUNvbnNlbnRHaXZlbmAgd2FzIHVzZWQgYW5kIG5vdCB3aGVuIGBzZXRDb29raWVDb25zZW50R2l2ZW5gIHdhcyB1c2VkLlxuICAgKiBUaGUgdGltZXN0YW1wIGlzIHRoZSBsb2NhbCB0aW1lc3RhbXAgd2hpY2ggZGVwZW5kcyBvbiB0aGUgdmlzaXRvcnMgdGltZS5cbiAgICovXG4gIGdldFJlbWVtYmVyZWRDb29raWVDb25zZW50KCkge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPHN0cmluZz4oJ2dldFJlbWVtYmVyZWRDb29raWVDb25zZW50Jyk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyBpZiB0byBub3QgdG8gdHJhY2sgdXNlcnMgd2hvIG9wdCBvdXQgb2YgdHJhY2tpbmcgdXNpbmcgTW96aWxsYSdzIChwcm9wb3NlZCkgRG8gTm90IFRyYWNrIHNldHRpbmcuXG4gICAqXG4gICAqIEBwYXJhbSBkb05vdFRyYWNrIElmIHRydWUsIHVzZXJzIHdobyBvcHRlZCBmb3IgRG8gTm90IFRyYWNrIGluIHRoZWlyIHNldHRpbmdzIHdvbid0IGJlIHRyYWNrZWQuXG4gICAqIEBzZWUge0BsaW5rIGh0dHBzOi8vd3d3LnczLm9yZy9UUi90cmFja2luZy1kbnQvfVxuICAgKi9cbiAgc2V0RG9Ob3RUcmFjayhkb05vdFRyYWNrOiBib29sZWFuKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0RG9Ob3RUcmFjaycsIGRvTm90VHJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIEFmdGVyIGNhbGxpbmcgdGhpcyBmdW5jdGlvbiwgdGhlIHVzZXIgd2lsbCBiZSBvcHRlZCBvdXQgYW5kIG5vIGxvbmdlciBiZSB0cmFja2VkLlxuICAgKi9cbiAgb3B0VXNlck91dCgpIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdvcHRVc2VyT3V0Jyk7XG4gIH1cblxuICAvKipcbiAgICogQWZ0ZXIgY2FsbGluZyB0aGlzIG1ldGhvZCB0aGUgdXNlciB3aWxsIGJlIHRyYWNrZWQgYWdhaW4uIENhbGwgdGhpcyBtZXRob2QgaWYgdGhlIHVzZXIgb3B0ZWQgb3V0IGJlZm9yZS5cbiAgICovXG4gIGZvcmdldFVzZXJPcHRPdXQoKSB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZm9yZ2V0VXNlck9wdE91dCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdHJ1ZSBvciBmYWxzZSBkZXBlbmRpbmcgb24gd2hldGhlciB0aGUgdXNlciBpcyBvcHRlZCBvdXQgb3Igbm90LjxiciAvPlxuICAgKiBOb3RlOiBUaGlzIG1ldGhvZCBtaWdodCBub3QgcmV0dXJuIHRoZSBjb3JyZWN0IHZhbHVlIGlmIHlvdSBhcmUgdXNpbmcgdGhlIG9wdCBvdXQgaWZyYW1lLlxuICAgKlxuICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdCByZXByZXNlbnRpbmcgd2hldGhlciB0aGUgdXNlciBpcyBvcHRlZCBvdXQgb3Igbm90LlxuICAgKi9cbiAgaXNVc2VyT3B0ZWRPdXQoKSB7XG4gICAgcmV0dXJuIHRoaXMuZ2V0RnVuY3Rpb248Ym9vbGVhbj4oJ2lzVXNlck9wdGVkT3V0Jyk7XG4gIH1cblxuICAvKipcbiAgICogRGlzYWJsZXMgYWxsIGZpcnN0IHBhcnR5IGNvb2tpZXMuPGJyIC8+XG4gICAqIEV4aXN0aW5nIE1hdG9tbyBjb29raWVzIGZvciB0aGlzIHdlYnNpdGVzIHdpbGwgYmUgZGVsZXRlZCBvbiB0aGUgbmV4dCBwYWdlIHZpZXcuXG4gICAqL1xuICBkaXNhYmxlQ29va2llcygpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkaXNhYmxlQ29va2llcycpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlbGV0ZXMgdGhlIHRyYWNraW5nIGNvb2tpZXMgY3VycmVudGx5IHNldCAodXNlZnVsIHdoZW4gY3JlYXRpbmcgbmV3IHZpc2l0cykuXG4gICAqL1xuICBkZWxldGVDb29raWVzKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ2RlbGV0ZUNvb2tpZXMnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHdoZXRoZXIgY29va2llcyBhcmUgZW5hYmxlZCBhbmQgc3VwcG9ydGVkIGJ5IHRoaXMgYnJvd3Nlci5cbiAgICpcbiAgICogQHJldHVybnMgUHJvbWlzZSBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBzdXBwb3J0IGFuZCBhY3RpdmF0aW9uIG9mIGNvb2tpZXMuXG4gICAqL1xuICBoYXNDb29raWVzKCk6IFByb21pc2U8Ym9vbGVhbj4ge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPGJvb2xlYW4+KCdoYXNDb29raWVzJyk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyB0cnVlIG9yIGZhbHNlIGRlcGVuZGluZyBvbiB3aGV0aGVyIGNvb2tpZXMgYXJlIGN1cnJlbnRseSBlbmFibGVkIG9yIGRpc2FibGVkLlxuICAgKlxuICAgKiBAcmV0dXJucyBQcm9taXNlIG9iamVjdCByZXByZXNlbnRpbmcgd2hldGhlciBjb29raWVzIGFyZSBlbmFibGVkIG9yIG5vdC5cbiAgICovXG4gIGFyZUNvb2tpZXNFbmFibGVkKCkge1xuICAgIHJldHVybiB0aGlzLmdldEZ1bmN0aW9uPGJvb2xlYW4+KCdhcmVDb29raWVzRW5hYmxlZCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHRyYWNraW5nIGNvb2tpZSBuYW1lIHByZWZpeC48YnIgLz5cbiAgICogRGVmYXVsdCBwcmVmaXggaXMgJ3BrJy5cbiAgICpcbiAgICogQHBhcmFtIHByZWZpeCBQcmVmaXggZm9yIHRoZSB0cmFja2luZyBjb29raWUgbmFtZXMuXG4gICAqL1xuICBzZXRDb29raWVOYW1lUHJlZml4KHByZWZpeDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0Q29va2llTmFtZVByZWZpeCcsIHByZWZpeCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgZG9tYWluIG9mIHRoZSB0cmFja2luZyBjb29raWVzLjxiciAvPlxuICAgKiBEZWZhdWx0IGlzIHRoZSBkb2N1bWVudCBkb21haW4uPGJyIC8+XG4gICAqIElmIHlvdXIgd2Vic2l0ZSBjYW4gYmUgdmlzaXRlZCBhdCBib3RoIHd3dy5leGFtcGxlLmNvbSBhbmQgZXhhbXBsZS5jb20sIHlvdSB3b3VsZCB1c2U6IGAnLmV4YW1wbGUuY29tJ2Agb3IgYCcqLmV4YW1wbGUuY29tJ2AuXG4gICAqXG4gICAqIEBwYXJhbSBkb21haW4gRG9tYWluIG9mIHRoZSB0cmFja2luZyBjb29raWVzLlxuICAgKi9cbiAgc2V0Q29va2llRG9tYWluKGRvbWFpbjogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0Q29va2llRG9tYWluJywgZG9tYWluKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXRzIHRoZSBwYXRoIG9mIHRoZSB0cmFja2luZyBjb29raWVzLjxiciAvPlxuICAgKiBEZWZhdWx0IGlzICcvJy5cbiAgICpcbiAgICogQHBhcmFtIHBhdGggUGF0aCBvZiB0aGUgdHJhY2tpbmcgY29va2llcy5cbiAgICovXG4gIHNldENvb2tpZVBhdGgocGF0aDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0Q29va2llUGF0aCcsIHBhdGgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgaWYgb3Igbm90IHRvIGVuYWJsZSB0aGUgU2VjdXJlIGNvb2tpZSBmbGFnIG9uIGFsbCBmaXJzdCBwYXJ0eSBjb29raWVzLjxiciAvPlxuICAgKiBUaGlzIHNob3VsZCBiZSB1c2VkIHdoZW4geW91ciB3ZWJzaXRlIGlzIG9ubHkgYXZhaWxhYmxlIHVuZGVyIEhUVFBTIHNvIHRoYXQgYWxsIHRyYWNraW5nIGNvb2tpZXMgYXJlIGFsd2F5cyBzZW50XG4gICAqIG92ZXIgc2VjdXJlIGNvbm5lY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSBzZWN1cmUgSWYgdHJ1ZSwgdGhlIHNlY3VyZSBjb29raWUgZmxhZyB3aWxsIGJlIHNldCBvbiBhbGwgZmlyc3QgcGFydHkgY29va2llcy5cbiAgICovXG4gIHNldFNlY3VyZUNvb2tpZShzZWN1cmU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRTZWN1cmVDb29raWUnLCBzZWN1cmUpO1xuICB9XG5cbiAgLyoqXG4gICAqIGRlZmF1bHRzIHRvIGBMYXhgLiBDYW4gYmUgc2V0IHRvIGBOb25lYCBvciBgU3RyaWN0YC48YnIgLz5cbiAgICogYE5vbmVgIHJlcXVpcmVzIGFsbCB0cmFmZmljIHRvIGJlIG9uIEhUVFBTIGFuZCB3aWxsIGFsc28gYXV0b21hdGljYWxseSBzZXQgdGhlIHNlY3VyZSBjb29raWUuXG4gICAqIEl0IGNhbiBiZSB1c2VmdWwgZm9yIGV4YW1wbGUgaWYgdGhlIHRyYWNrZWQgd2Vic2l0ZSBpcyBhbiBpZnJhbWUuPGJyIC8+XG4gICAqIGBTdHJpY3RgIG9ubHkgd29ya3MgaWYgeW91ciBNYXRvbW8gYW5kIHRoZSB3ZWJzaXRlIHJ1bnMgb24gdGhlIHZlcnkgc2FtZSBkb21haW4uXG4gICAqXG4gICAqIEBwYXJhbSBwb2xpY3kgRWl0aGVyIGBMYXhgLCBgU3RyaWN0YCBvciBgTm9uZWBcbiAgICogKi9cbiAgc2V0Q29va2llU2FtZVNpdGUocG9saWN5OiAnTGF4JyB8ICdTdHJpY3QnIHwgJ05vbmUnKSB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0Q29va2llU2FtZVNpdGUnLCBwb2xpY3kpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHZpc2l0b3IgY29va2llIHRpbWVvdXQuPGJyIC8+XG4gICAqIERlZmF1bHQgaXMgMTMgbW9udGhzLlxuICAgKlxuICAgKiBAcGFyYW0gdGltZW91dCBUaW1lb3V0LCBpbiBzZWNvbmRzLCBmb3IgdGhlIHZpc2l0b3IgY29va2llIHRpbWVvdXQuXG4gICAqL1xuICBzZXRWaXNpdG9yQ29va2llVGltZW91dCh0aW1lb3V0OiBudW1iZXIpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRWaXNpdG9yQ29va2llVGltZW91dCcsIHRpbWVvdXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHJlZmVycmFsIGNvb2tpZSB0aW1lb3V0LjxiciAvPlxuICAgKiBEZWZhdWx0IGlzIDYgbW9udGhzLlxuICAgKlxuICAgKiBAcGFyYW0gdGltZW91dCBUaW1lb3V0LCBpbiBzZWNvbmRzLCBmb3IgdGhlIHJlZmVycmFsIGNvb2tpZSB0aW1lb3V0LlxuICAgKi9cbiAgc2V0UmVmZXJyYWxDb29raWVUaW1lb3V0KHRpbWVvdXQ6IG51bWJlcik6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldFJlZmVycmFsQ29va2llVGltZW91dCcsIHRpbWVvdXQpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgdGhlIHNlc3Npb24gY29va2llIHRpbWVvdXQuPGJyIC8+XG4gICAqIERlZmF1bHQgaXMgMzAgbWludXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHRpbWVvdXQgVGltZW91dCwgaW4gc2Vjb25kcywgZm9yIHRoZSBzZXNzaW9uIGNvb2tpZSB0aW1lb3V0LlxuICAgKi9cbiAgc2V0U2Vzc2lvbkNvb2tpZVRpbWVvdXQodGltZW91dDogbnVtYmVyKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignc2V0U2Vzc2lvbkNvb2tpZVRpbWVvdXQnLCB0aW1lb3V0KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGRzIGEgY2xpY2sgbGlzdGVuZXIgdG8gYSBzcGVjaWZpYyBsaW5rIGVsZW1lbnQuPGJyIC8+XG4gICAqIFdoZW4gY2xpY2tlZCwgTWF0b21vIHdpbGwgbG9nIHRoZSBjbGljayBhdXRvbWF0aWNhbGx5LlxuICAgKlxuICAgKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IG9uIHdoaWNoIHRvIGFkZCBhIGNsaWNrIGxpc3RlbmVyLlxuICAgKi9cbiAgYWRkTGlzdGVuZXIoZWxlbWVudDogRWxlbWVudCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ2FkZExpc3RlbmVyJywgZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyB0aGUgcmVxdWVzdCBtZXRob2QgdG8gZWl0aGVyIGBHRVRgIG9yIGBQT1NUYC4gKFRoZSBkZWZhdWx0IGlzIGBHRVRgLik8YnIgLz5cbiAgICogVG8gdXNlIHRoZSBgUE9TVGAgcmVxdWVzdCBtZXRob2QsIGVpdGhlcjo8YnIgLz5cbiAgICogMSkgdGhlIE1hdG9tbyBob3N0IGlzIHRoZSBzYW1lIGFzIHRoZSB0cmFja2VkIHdlYnNpdGUgaG9zdCAoTWF0b21vIGluc3RhbGxlZCBpbiB0aGUgc2FtZSBkb21haW4gYXMgeW91ciB0cmFja2VkIHdlYnNpdGUpLCBvcjxiciAvPlxuICAgKiAyKSBpZiBNYXRvbW8gaXMgbm90IGluc3RhbGxlZCBvbiB0aGUgc2FtZSBob3N0IGFzIHlvdXIgd2Vic2l0ZSwgeW91IG5lZWQgdG8gZW5hYmxlIENPUlMgKENyb3NzIGRvbWFpbiByZXF1ZXN0cykuPGJyIC8+XG4gICAqIEtlZXAgaW4gbWluZCB0aGF0IHdoZW4gTWF0b21vIHVzZXMgc2VuZEJlYWNvbigpIGZvciBzZW5kaW5nIHRyYWNraW5nIHJlcXVlc3RzICh3aGljaCBpcyBlbmFibGVkIGJ5IGRlZmF1bHQpIGl0IHdpbGwgc2VuZCBkYXRhIHZpYSBgUE9TVGAuXG4gICAqIElmIHlvdSB3YW50IE1hdG9tbyB0byBuZXZlciBzZW5kIGBQT1NUYCByZXF1ZXN0cywgeW91IGNhbiB1c2UgdGhpcyBtZXRob2QgdG8gZm9yY2UgYEdFVGAgd2hpY2ggd2lsbCBhdXRvbWF0aWNhbGx5IGRpc2FibGUgYHNlbmRCZWFjb25gLlxuICAgKlxuICAgKiBAcGFyYW0gbWV0aG9kIEhUVFAgbWV0aG9kIGZvciBzZW5kaW5nIGluZm9ybWF0aW9uIHRvIHRoZSBNYXRvbW8gc2VydmVyLlxuICAgKiBAc2VlIHtAbGluayBodHRwczovL21hdG9tby5vcmcvZmFxL2hvdy10by9mYXFfMTg2OTQvfGVuYWJsZSBDT1JTIChDcm9zcyBkb21haW4gcmVxdWVzdHMpfVxuICAgKi9cbiAgc2V0UmVxdWVzdE1ldGhvZChtZXRob2Q6ICdHRVQnIHwgJ1BTVCcpOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdzZXRSZXF1ZXN0TWV0aG9kJywgbWV0aG9kKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBFbmFibGVzIHRoZSB1c2Ugb2YgYG5hdmlnYXRvci5zZW5kQmVhY29uKClgXG4gICAqIFdoeSB3b3VsZCBJIHVzZSB0aGlzIGZlYXR1cmU/IFdoZW4gZW5hYmxpbmcgdGhpcyBmZWF0dXJlLCBsaWtlbHkgbW9yZSBvZiB5b3VyIGNsaWNrcyBvbiBkb3dubG9hZHMvb3V0bGlua3Mgd2lsbCBiZSB0cmFja2VkXG4gICAqIGFuZCByZXBvcnRlZCBpbiBNYXRvbW8gKG1vcmUgYWNjdXJhY3kpLiBBbHNvIGl0IHdpbGwgcmVkdWNlIHRoZSBsaW5rIHRyYWNraW5nIHRpbWUgdG8gYSBtaW5pbXVtIG9mIDEwMG1zIGluc3RlYWQgb2ZcbiAgICogdGhlIGRlZmF1bHQgNTAwbXMgKGRlZmF1bHQgd2hpY2ggY2FuIGJlIGluY3JlYXNlZCksIHNvIHRoYXQgd2hlbiB0aGV5IGNsaWNrIG9uIGFuIG91dGxpbmsgdGhlbiB0aGUgbmF2aWdhdGlvbiB0byB0aGlzXG4gICAqIGNsaWNrZWQgcGFnZSB3aWxsIGhhcHBlbiA0MDBtcyBmYXN0ZXIgKGZhc3RlciBhbmQgYmV0dGVyIHVzZXIgZXhwZXJpZW5jZSkuXG4gICAqIFNlbmQgYmVhY29uIHdpbGwgb25seSBiZSB1c2VkIGlmIHRoZSBicm93c2VyIGFjdHVhbGx5IHN1cHBvcnRzIGl0LjxiciAvPlxuICAgKiBTb21lIGFkIGJsb2NrZXJzIG9yIG90aGVyIGJyb3dzZXIgZXh0ZW5zaW9ucyBtYXkgYmxvY2sgdGhlIGBzZW5kQmVhY29uYCBmZWF0dXJlIHdoaWNoIGNvdWxkIGFnYWluIGNhdXNlIGxpbWl0ZWQgZGF0YVxuICAgKiBsb3NzIGluIHRoZXNlIGNhc2VzLjxiciAvPlxuICAgKiBOb3RlOiB1c2Ugb2YgYHNlbmRCZWFjb25gIGhhcyBiZWVuIGJlIGVuYWJsZWQgYnkgZGVmYXVsdCBzaW5jZSBNYXRvbW8gNC5cbiAgICovXG4gIGVuYWJsZUFsd2F5c1VzZVNlbmRCZWFjb24oKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignYWx3YXlzVXNlU2VuZEJlYWNvbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIERpc2FibGVzIHNlbmRpbmcgdHJhY2tpbmcgdHJhY2tpbmcgcmVxdWVzdHMgdXNpbmcgYG5hdmlnYXRvci5zZW5kQmVhY29uYCB3aGljaCBpcyBlbmFibGVkIGJ5IGRlZmF1bHQuXG4gICAqL1xuICBkaXNhYmxlQWx3YXlzVXNlU2VuZEJlYWNvbigpIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKCdkaXNhYmxlQWx3YXlzVXNlU2VuZEJlYWNvbicpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldHMgYSBmdW5jdGlvbiB0aGF0IHdpbGwgcHJvY2VzcyB0aGUgcmVxdWVzdCBjb250ZW50LjxiciAvPlxuICAgKiBUaGUgZnVuY3Rpb24gd2lsbCBiZSBjYWxsZWQgb25jZSB0aGUgcmVxdWVzdCAocXVlcnkgcGFyYW1ldGVycyBzdHJpbmcpIGhhcyBiZWVuIHByZXBhcmVkLCBhbmQgYmVmb3JlIHRoZSByZXF1ZXN0IGNvbnRlbnQgaXMgc2VudC5cbiAgICpcbiAgICogQHBhcmFtIGNhbGxiYWNrIEZ1bmN0aW9uIHRoYXQgd2lsbCBwcm9jZXNzIHRoZSByZXF1ZXN0IGNvbnRlbnQuXG4gICAqL1xuICBzZXRDdXN0b21SZXF1ZXN0UHJvY2Vzc2luZyhjYWxsYmFjazogKHF1ZXJ5UGFyYW1ldGVyczogc3RyaW5nKSA9PiB2b2lkKTogdm9pZCB7XG4gICAgdGhpcy5pbnZva2VGdW5jdGlvbignc2V0Q3VzdG9tUmVxdWVzdFByb2Nlc3NpbmcnLCBjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogU2V0cyByZXF1ZXN0IENvbnRlbnQtVHlwZSBoZWFkZXIgdmFsdWUuPGJyIC8+XG4gICAqIEFwcGxpY2FibGUgd2hlbiBgUE9TVGAgcmVxdWVzdCBtZXRob2QgaXMgdXNlZCB2aWEgc2V0UmVxdWVzdE1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIGNvbnRlbnRUeXBlIFZhbHVlIGZvciBDb250ZW50LVR5cGUgSFRUUCBoZWFkZXIuXG4gICAqL1xuICBzZXRSZXF1ZXN0Q29udGVudFR5cGUoY29udGVudFR5cGU6IHN0cmluZyk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldFJlcXVlc3RDb250ZW50VHlwZScsIGNvbnRlbnRUeXBlKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEaXNhYmxlcyB0aGUgZmVhdHVyZSB3aGljaCBncm91cHMgdG9nZXRoZXIgbXVsdGlwbGUgdHJhY2tpbmcgcmVxdWVzdHMgYW5kIHNlbmQgdGhlbSBhcyBhIGJ1bGsgYFBPU1RgIHJlcXVlc3QuPGJyIC8+XG4gICAqIERpc2FibGluZyB0aGlzIGZlYXR1cmUgaXMgdXNlZnVsIHdoZW4geW91IHdhbnQgdG8gYmUgYWJsZSB0byByZXBsYXkgYWxsIGxvZ3M6IG9uZSBtdXN0IHVzZSBgZGlzYWJsZVF1ZXVlUmVxdWVzdGBcbiAgICogdG8gZGlzYWJsZSB0aGlzIGJlaGF2aW9yIHRvIGxhdGVyIGJlIGFibGUgdG8gcmVwbGF5IGxvZ2dlZCBNYXRvbW8gbG9ncyAob3RoZXJ3aXNlIGEgc3Vic2V0IG9mIHRoZSByZXF1ZXN0c1xuICAgKiB3b3VsZG4ndCBiZSBhYmxlIHRvIGJlIHJlcGxheWVkKS5cbiAgICovXG4gIGRpc2FibGVRdWV1ZVJlcXVlc3QoKTogdm9pZCB7XG4gICAgdGhpcy5zZXRGdW5jdGlvbignZGlzYWJsZVF1ZXVlUmVxdWVzdCcpO1xuICB9XG5cbiAgLyoqXG4gICAqIERlZmluZXMgYWZ0ZXIgaG93IG1hbnkgbWlsbGlzZWNvbmRzIGEgcXVldWVkIHJlcXVlc3RzIHdpbGwgYmUgZXhlY3V0ZWQgYWZ0ZXIgdGhlIHJlcXVlc3Qgd2FzIHF1ZXVlZCBpbml0aWFsbHkuXG4gICAqIFRoZSBoaWdoZXIgdGhlIHZhbHVlIHRoZSBtb3JlIHRyYWNraW5nIHJlcXVlc3RzIGNhbiBiZSBzZW50IHRvZ2V0aGVyIGF0IG9uY2UuIGludGVydmFsIGhhcyB0byBiZSBhdCBsZWFzdCAxMDAwICgxMDAwbXMgPSAxcylcbiAgICogYW5kIGRlZmF1bHRzIHRvIDIuNSBzZWNvbmRzLlxuICAgKi9cbiAgc2V0UmVxdWVzdFF1ZXVlSW50ZXJ2YWwoaW50ZXJ2YWw6IG51bWJlcikge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ3NldFJlcXVlc3RRdWV1ZUludGVydmFsJywgaW50ZXJ2YWwpO1xuICB9XG5cbiAgLyoqXG4gICAqIE1hbnVhbGx5IHNldCBwZXJmb3JtYW5jZSBtZXRyaWNzIGluIG1pbGxpc2Vjb25kcyBpbiBhIFNpbmdsZSBQYWdlIEFwcCBvciB3aGVuIE1hdG9tbyBjYW5ub3QgZGV0ZWN0IHNvbWUgbWV0cmljcy5cbiAgICogWW91IGNhbiBzZXQgcGFyYW1ldGVycyB0byB1bmRlZmluZWQgaWYgeW91IGRvIG5vdCB3YW50IHRvIHRyYWNrIHRoaXMgbWV0cmljLiBBdCBsZWFzdCBvbmUgcGFyYW1ldGVyIG5lZWRzIHRvIGJlIHNldC5cbiAgICogVGhlIHNldCBwZXJmb3JtYW5jZSB0aW1pbmdzIHdpbGwgYmUgdHJhY2tlZCBvbmx5IG9uIHRoZSBuZXh0IHBhZ2Ugdmlldy4gSWYgeW91IHRyYWNrIGFub3RoZXIgcGFnZSB2aWV3IHRoZW4geW91IHdpbGwgbmVlZCB0byBzZXRcbiAgICogdGhlIHBlcmZvcm1hbmNlIHRpbWluZ3MgYWdhaW4uPGJyIC8+XG4gICAqIFJlcXVpcmVzIE1hdG9tbyA0LjUgb3IgbmV3ZXIuXG4gICAqXG4gICAqIEBwYXJhbSBbbmV0d29ya1RpbWVJbk1zXSBkXG4gICAqIEBwYXJhbSBbc2VydmVyVGltZUluTXNdIGRcbiAgICogQHBhcmFtIFt0cmFuc2ZlclRpbWVJbk1zXSBkXG4gICAqIEBwYXJhbSBbZG9tUHJvY2Vzc2luZ1RpbWVJbk1zXSBkXG4gICAqIEBwYXJhbSBbZG9tQ29tcGxldGlvblRpbWVJbk1zXSBkXG4gICAqIEBwYXJhbSBbb25sb2FkVGltZUluTXNdIGRcbiAgICovXG4gIHNldFBhZ2VQZXJmb3JtYW5jZVRpbWluZyhcbiAgICBuZXR3b3JrVGltZUluTXM6IG51bWJlciB8IHVuZGVmaW5lZCxcbiAgICBzZXJ2ZXJUaW1lSW5NczogbnVtYmVyIHwgdW5kZWZpbmVkLFxuICAgIHRyYW5zZmVyVGltZUluTXM6IG51bWJlciB8IHVuZGVmaW5lZCxcbiAgICBkb21Qcm9jZXNzaW5nVGltZUluTXM6IG51bWJlciB8IHVuZGVmaW5lZCxcbiAgICBkb21Db21wbGV0aW9uVGltZUluTXM6IG51bWJlciB8IHVuZGVmaW5lZCxcbiAgICBvbmxvYWRUaW1lSW5NczogbnVtYmVyIHwgdW5kZWZpbmVkLFxuICApOiB2b2lkIHtcbiAgICB0aGlzLnNldEZ1bmN0aW9uKFxuICAgICAgJ3NldFBhZ2VQZXJmb3JtYW5jZVRpbWluZycsXG4gICAgICBuZXR3b3JrVGltZUluTXMsXG4gICAgICBzZXJ2ZXJUaW1lSW5NcyxcbiAgICAgIHRyYW5zZmVyVGltZUluTXMsXG4gICAgICBkb21Qcm9jZXNzaW5nVGltZUluTXMsXG4gICAgICBkb21Db21wbGV0aW9uVGltZUluTXMsXG4gICAgICBvbmxvYWRUaW1lSW5NcyxcbiAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEVuYWJsZXMgdHJhY2tpbmcgb2YgSmF2YVNjcmlwdCBlcnJvcnMuXG4gICAqIE9uY2UgeW91IGVuYWJsZSBKUyBlcnJvciB0cmFja2luZywgSlMgZXJyb3JzIHdpbGwgYmUgdHJhY2tlZCBhcyBFdmVudHMgYW5kIGFwcGVhciBpbiB0aGUgQmVoYXZpb3IgPiBFdmVudHMgcmVwb3J0LjxiciAvPlxuICAgKiBFdmVudHMgd2lsbCBoYXZlIHRoZSBmb2xsb3dpbmcgZGV0YWlsczo8YnIgLz5cbiAgICogLSBFdmVudCBjYXRlZ29yeSA9IEphdmFTY3JpcHQgRXJyb3JzXG4gICAqIC0gRXZlbnQgYWN0aW9uID0gdGhlIFVSTCBvZiB0aGUgcGFnZSB3aGVyZSB0aGUgZXJyb3Igb2NjdXJyZWQsIHdpdGggdGhlIGxpbmUgbnVtYmVyIGFwcGVuZGVkIChhbmQgdGhlIGNoYXJhY3RlciBjb2x1bW4gbnVtYmVyKVxuICAgKiAtIEV2ZW50IG5hbWUgPSB0aGUgZXJyb3IgbWVzc2FnZSBhcyBpdCBhcHBlYXJzIGluIHlvdXIgdmlzaXRvcnPigJkgYnJvd3NlcuKAmXMgY29uc29sZSAoZGV2ZWxvcGVyIHRvb2xzKVxuICAgKi9cbiAgZW5hYmxlSlNFcnJvclRyYWNraW5nKCk6IHZvaWQge1xuICAgIHRoaXMuc2V0RnVuY3Rpb24oJ2VuYWJsZUpTRXJyb3JUcmFja2luZycpO1xuICB9XG59XG4iXX0=