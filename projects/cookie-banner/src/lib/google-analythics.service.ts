import { Injectable } from '@angular/core';

// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Injectable()
export class GoogleAnalyticsService {

    /**
     * Send relevant events to Google Analythics. For more information, look at:
     * https://developers.google.com/analytics/devguides/collection/gtagjs/events
     */
   public eventEmitter(
       eventName: string,
       eventCategory: string,
       eventAction: string,
       eventLabel: string = null,
       eventValue: number = null ): void {
            gtag('event', eventName, { eventCategory, eventLabel, eventAction, eventValue });
       }
}
