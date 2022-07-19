import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CookieBannerModule } from 'projects/cookie-banner/src/lib/cookie-banner.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'projects/multi-select/src/public-api';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    CookieBannerModule,
    MultiSelectModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
