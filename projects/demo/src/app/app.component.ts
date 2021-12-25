import { Component } from '@angular/core';
import { CookieOption, Options } from 'projects/cookie-banner/src/public-api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  options: Options = {
    title: 'Es gibt Kekse!',
    description: 'Bitte wähle aus, welche Kekse wir laden dürfen.',
    buttonAll: 'Alle akzeptieren',
    buttonSelected: 'Nur ausgewählte akzeptieren',
    labelNecessary: 'Notwendig',
    options: [
      new CookieOption({value: 'analythics', label: 'Analythics'}),
      new CookieOption({value: 'external', label: 'Externe Elemente'})
    ]
  }
}
