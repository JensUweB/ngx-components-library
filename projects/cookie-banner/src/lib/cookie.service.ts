import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CookieOption } from './cookie-banner.component';

export class CookieConsent {
  necessary: boolean;
  options: CookieOption[];
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
    this.init();
  }

  /**
   * Initializes the cookie service
   */
  init(): void {
    this.cookieConsentBS = new BehaviorSubject<CookieConsent>(
      this._cookieConsent
    );
    const item = localStorage.getItem('cookieConsent');
    if (item) {
      this._cookieConsent = JSON.parse(item);
      this.showCookieBanner.next(false);
      this.setCookieConsent(this._cookieConsent);
    } else {
      this._cookieConsent = {
        necessary: true,
        options: [],
      };
    }

    console.log('[CookieService] initialized.');
  }

  public getCookieConsent(): Observable<CookieConsent> {
    return this.cookieConsentBS.asObservable();
  }

  public getOption(value: string) {
    return this.cookieConsentBS.pipe(
      map((val) => val?.options?.find((i) => i.value === value))
    );
  }

  /**
   * Saves cookieConsent to session storage and loads Google Analythics, if option with label analythics
   *  & analythicsId are set.
   * @param consent cookie consent object
   */
  public setCookieConsent(consent: CookieConsent): void {
    this._cookieConsent = consent;
    this.cookieConsentBS.next(consent);
    this.showCookieBanner.next(false);
    localStorage.setItem('cookieConsent', JSON.stringify(consent));
    console.log('[CookieService] Cookie settings saved: ', consent);

    if (
      this._cookieConsent.options.find(
        (i) => i.label === 'analythics' && i.checked
      ) &&
      this.gaTrackingId
    ) {
      this.loadGoogleAnalytics(
        this.gaTrackingId,
        this.gaTrackingId.startsWith('UA') ? 'ua' : 'ga4'
      );
    }
  }

  /**
   * Inserts Google Analythics scripts into the head.
   * If the user is navigating to another sub page, google analythics will be updated accordingly.
   *
   * @param trackingID Google Analytics id, beginnning with "UA-" or "G-"
   * @param type Your Google Analythics type
   */
  loadGoogleAnalytics(trackingID: string, type: 'ua' | 'ga4' = 'ua'): void {
    // Insert Google Analytics scripts
    const gtmScript: HTMLScriptElement = document.createElement('script');
    const script = document.createElement('script');
    script.src = `https://www.googletagmanager.com/gtag/js?id=${trackingID}`;

    switch (type) {
      case 'ga4':
        gtmScript.text = `window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${trackingID}');`;
        break;
      case 'ua':
      default:
        gtmScript.setAttribute('data-cookieconsent', 'ignore');
        gtmScript.text = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${trackingID}'); window.dataLayer = window.dataLayer || [];`;
        break;
    }

    document.head.appendChild(script);
    document.head.append(gtmScript);

    const noscript: HTMLElement = document.createElement('noscript');
    noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${trackingID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
    document.body.append(noscript);

    // Tell Google Analytics that the sub page has changed
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        gtag('config', this.gaTrackingId, {
          page_path: event.urlAfterRedirects,
        });
      }
    });
  }
}
