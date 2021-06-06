import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export class CookieConsent {
    necessary: boolean;
    analythics: boolean;
    marketing: boolean;
    preferences: boolean;
    comfort: boolean;
}

// tslint:disable-next-line: ban-types
declare let gtag: Function;

@Injectable()
export class CookieService {

    public showCookieBanner = new BehaviorSubject<boolean>(true);
    public gaTrackingId: string;

    private cookieConsentBS: BehaviorSubject<CookieConsent>;
    // tslint:disable-next-line: variable-name
    private _cookieConsent: CookieConsent;

    constructor(private router: Router) {
    }

    /**
     * Initializes the cookie service
     */
    init(): void {
        this.cookieConsentBS = new BehaviorSubject<CookieConsent>(this._cookieConsent);
        const item = localStorage.getItem('cookieConsent');
        if (item) {
            this._cookieConsent = JSON.parse(item);
            this.showCookieBanner.next(false);
            this.setCookieConsent(this._cookieConsent);
        } else {
            this._cookieConsent = {
                necessary: true,
                analythics: false,
                marketing: false,
                preferences: false,
                comfort: false
            };
        }

        console.log('[CookieService] initialized.');
    }

    public getCookieConsent(): Observable<CookieConsent> {
        return this.cookieConsentBS.asObservable();
    }

    /**
     * Saves cookieConsent to session storage and loads Google Analythics, if allowed & analythicsId set.
     * @param consent cookie consent object
     */
    public setCookieConsent(consent: CookieConsent): void {
        this._cookieConsent = consent;
        this.cookieConsentBS.next(consent);
        this.showCookieBanner.next(false);
        localStorage.setItem('cookieConsent', JSON.stringify(consent));
        console.log('[CookieService] Cookie settings saved: ', consent);

        if (this._cookieConsent.analythics && this.gaTrackingId) {
            this.loadGoogleAnalytics(this.gaTrackingId);
        }
    }

    /**
     * Inserts Google Analythics scripts into the head.
     * If the user is navigating to another sub page, google analythics will be updated accordingly.
     * @param trackingID google analythics id, beginnning with "UA-"
     */
    loadGoogleAnalytics(trackingID: string): void {

        // Insert google analythics scripts
        const gaScript = document.createElement('script');
        gaScript.setAttribute('async', 'true');
        gaScript.setAttribute('src', `https://www.googletagmanager.com/gtag/js?id=${ trackingID }`);
        gaScript.id = 'gaScript1';

        const gaScript2 = document.createElement('script');
        gaScript2.id = 'gaScript2';
        gaScript2.innerText = `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date());gtag(\'config\', \'${ trackingID }\');`;

        document.documentElement.firstChild.appendChild(gaScript);
        document.documentElement.firstChild.appendChild(gaScript2);


        // Tell google analythics that the sub page has changed
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd && this._cookieConsent.analythics){
                gtag('config', this.gaTrackingId, { page_path: event.urlAfterRedirects });
            }
        });
    }
}
