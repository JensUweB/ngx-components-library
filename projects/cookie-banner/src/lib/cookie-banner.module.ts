import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CookieBannerComponent } from './cookie-banner.component';
import { CookieService } from './cookie.service';
import { GoogleAnalyticsService } from './google-analythics.service';



@NgModule({
  declarations: [CookieBannerComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CookieBannerComponent],
  providers: [CookieService, GoogleAnalyticsService]
})
export class CookieBannerModule { }
