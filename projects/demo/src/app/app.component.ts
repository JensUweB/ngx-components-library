import { Component } from '@angular/core';
import {
  CookieOption,
  CookieService,
  Options,
} from 'projects/cookie-banner/src/public-api';
import { MultiSelectOptions } from 'projects/multi-select/src/lib/options.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // NgxCookieBanner
  options: Options = {
    title: 'Es gibt Kekse!',
    description: 'Bitte wähle aus, welche Kekse wir laden dürfen.',
    buttonAll: 'Alle akzeptieren',
    buttonSelected: 'Nur ausgewählte akzeptieren',
    labelNecessary: 'Notwendig',
    options: [
      new CookieOption({ value: 'analythics', label: 'Analythics' }),
      new CookieOption({ value: 'external', label: 'Externe Elemente' }),
    ],
  };

  // NgxMultiSelect
  selectedItem: any[];
  selectData: any[] = [
    { key: 'nessesary', value: 'Nessesary' },
    { key: 'analythics', value: 'Analythics' },
    { key: 'performance', value: 'Performance' },
    { key: 'external', value: 'External Media' },
  ];
  selectOptions: MultiSelectOptions = {
    labelKey: 'value',
    dataKey: 'key',
    groupBy: null,
    maxSelection: -1,
    onlyOneGroupSelectable: false,
  };

  constructor(cookieService: CookieService) {
    cookieService.gaTrackingId = 'ga-tracking-id';
    cookieService
      .getOption('analythics')
      .subscribe({ next: (val) => console.log('analythics', val) });
  }

  onMultiSelectChange($event) {
    console.log('onMultiSelectChange', $event);
  }
}
