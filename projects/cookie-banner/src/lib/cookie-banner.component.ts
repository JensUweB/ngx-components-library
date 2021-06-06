import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CookieService } from './cookie.service';

@Component({
  selector: 'lib-cookie-banner',
  templateUrl: './cookie-banner.component.html'
})
export class CookieBannerComponent implements OnInit {
  @Input() options: {
    title: string;
    description: string;
    buttonAll: string;
    buttonSelected: string;
    labelNecessary: string;
    labelAnalythics: string;
    labelMarketing: string;
    labelPreferences: string;
    labelComfort: string;
  };
  showBanner: boolean;
  cookieForm: FormGroup;

  constructor(private fb: FormBuilder, private cookieService: CookieService) {
    if (!this.options) {
      this.options = {
        title: '',
        description: '',
        buttonAll: 'Alle Cookies akzeptieren',
        buttonSelected: 'Nur ausgewählte akzeptieren',
        labelNecessary: '',
        labelAnalythics: '',
        labelMarketing: '',
        labelPreferences: '',
        labelComfort: '',
      };
    }

    this.cookieForm = this.fb.group({
      necessary: true,
      analythics: false,
      marketing: false,
      preferences: false,
      comfort: false
    });

    // tslint:disable-next-line: deprecation
    this.cookieService.showCookieBanner.subscribe({
      next: (data) => {
        this.showBanner = data;
      }
    });
  }

  ngOnInit(): void {
    if (!this.showBanner) {
      this.bannerFadeOut(0);
    }
  }

  saveCookies(all?: boolean): void {
    if (all) {
        this.cookieForm.get('analythics').setValue(this.options.labelAnalythics ? true : false);
        this.cookieForm.get('marketing').setValue(this.options.labelMarketing ? true : false);
        this.cookieForm.get('preferences').setValue(this.options.labelPreferences ? true : false);
        this.cookieForm.get('comfort').setValue(this.options.labelComfort ? true : false);
    }
    this.cookieService.setCookieConsent({
      necessary: true,
      analythics: this.cookieForm.get('analythics').value,
      marketing: this.cookieForm.get('marketing').value,
      preferences: this.cookieForm.get('preferences').value,
      comfort: this.cookieForm.get('comfort').value
    });

    this.bannerFadeOut();
  }

  bannerFadeOut(time = 1): void {
    const doc = document.getElementById('cookie-banner') as HTMLDivElement;
    doc.style.animation = time + 's ease-out forwards slideOutToBottom';
  }

}
