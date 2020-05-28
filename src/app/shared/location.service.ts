import {Injectable} from '@angular/core';
import countries from 'i18n-iso-countries';
import countriesEN from 'i18n-iso-countries/langs/en.json';
import countriesNL from 'i18n-iso-countries/langs/nl.json';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject} from 'rxjs';

countries.registerLocale(countriesEN);
countries.registerLocale(countriesNL);

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  readonly codes = Object.keys(countries.getAlpha2Codes());
  readonly names = new ReplaySubject<{ [code: string]: string }>(1);

  constructor(private translateService: TranslateService) {
    this.refreshNames(this.translateService.currentLang);

    this.translateService.onLangChange
      .subscribe(event => this.refreshNames(event.lang));
  }

  private refreshNames(language: string) {
    this.names.next(countries.getNames(language));
  }
}
