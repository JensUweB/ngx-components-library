# CookieBanner

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.9.

## Usage
> Run `npm i @jensuweb/ng-cookie-banner`

> Add CookieBannerModule to your AppModule
``` ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieBannerModule } from '@jensuweb/ng-cookie-banner';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CookieBannerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```
> Import library styles in your public scss file and set color variables.
> Instead of importing, you can copy the scss code and modify it to your needs. Don't forget to place it inside your public styles, otherwise it will not work.
``` scss
// Compilation will fail without this variables
// Set colors as you like
 $color-cookie-background: #ccc;
 $color-cookie-checkbox-border: #ccc;
 @import "@jensuweb/ng-cookie-banner/src/lib/cookie-banner.component.scss";
```
> Setup options object in app.component
``` ts
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  public cookieOptions = {
    title: 'Banner Title',
    description: 'I respect your privacy and will only load the cookies, you want',
    buttonAll: 'Acceppt all',
    buttonSelected: 'Accept only selected',
    // Setting label value to null will hide corresponding checkbox
    // Hidden checkboxes are always set to false
    labelNecessary: 'Necessary',
    labelAnalythics: 'Analythics',
    labelMarketing: null,
    labelPreferences: null,
    labelComfort: null,
  };

  constructor() {}
}
```
> Add cookie banner to your app.component.html. If you use angular universal, don't forget to show banner only on platform browser, or it will throw errors.
``` html
<router-outlet></router-outlet>
<lib-cookie-banner [options]="cookieOptions"></lib-cookie-banner>
```
The CookieConsent object, which includes the user cookie selection, will be stored in "cookieConsent" session storage variable.

## Subscribe to Cookie Consent
The last thing to do is to subscripe to getCookieConsent and load your content,
depending on what the user wants to allow
``` ts
export class AppComponent {
    // ...
    constructor(private cookieService: CookieService) {
        this.cookieService.getCookieConsent().subscribe({
            next: (result: CookieConsent) => {
                if (result.analythics) {
                    this.cookieService.loadGoogleAnalytics('myTrackingId');
                }
                if (result.marketing) {
                // enable your marketing stuff here
                }
                // ...more cookie consent options...
            }
        });
    }
    // ...
}
```

## Code scaffolding

Run `ng generate component component-name --project cookie-banner` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project cookie-banner`.
> Note: Don't forget to add `--project cookie-banner` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build cookie-banner` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build cookie-banner`, go to the dist folder `cd dist/cookie-banner` and run `npm publish`.

## Running unit tests

Run `ng test cookie-banner` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
