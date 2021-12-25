import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { CookieService } from './cookie.service';

export class CookieOption {
  value: string = '';
  label: string = '';
  checked: boolean = false;

  constructor(input?) {
    if (input) {
      this.value = input.value;
      this.label = input.label;
    }
  }
}

export interface Options {
  title: string;
  description: string;
  buttonAll: string;
  buttonSelected: string;
  labelNecessary: string;
  options: CookieOption[];
}

@Component({
  selector: 'lib-cookie-banner',
  templateUrl: './cookie-banner.component.html'
})
export class CookieBannerComponent implements OnInit {
  @Input() options: Options;
  showBanner: boolean;

  constructor(private fb: FormBuilder, private cookieService: CookieService) {
    if (!this.options) {
      this.options = {
        title: '',
        description: '',
        buttonAll: 'Alle Cookies akzeptieren',
        buttonSelected: 'Nur ausgewählte akzeptieren',
        labelNecessary: 'Notwendig',
        options: []
      };
    }
    this.options.options.push(
      new CookieOption({value: 'necessary', label: 'Notwendig'})
      );

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
        for (const item of this.options.options) {
          item.checked = true;
        }
    }
    this.cookieService.setCookieConsent({
      necessary: true,
      options: this.options.options
    });

    this.bannerFadeOut();
  }

  bannerFadeOut(time = 1): void {
    const doc = document.getElementById('cookie-banner') as HTMLDivElement;
    doc.style.animation = time + 's ease-out forwards slideOutToBottom';
  }

}
