import {Injectable} from '@angular/core';
import countries from 'i18n-iso-countries';
import countriesEN from 'i18n-iso-countries/langs/en.json';
import countriesIT from 'i18n-iso-countries/langs/it.json';
import countriesNL from 'i18n-iso-countries/langs/nl.json';
import countriesPT from 'i18n-iso-countries/langs/pt.json';
import {TranslateService} from '@ngx-translate/core';
import {ReplaySubject} from 'rxjs';

countries.registerLocale(countriesEN);
countries.registerLocale(countriesIT);
countries.registerLocale(countriesNL);
countries.registerLocale(countriesPT);

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  readonly codes = Object.keys(countries.getAlpha2Codes());
  readonly names = new ReplaySubject<{ [code: string]: string }>(1);

  constructor(private translateService: TranslateService) {
    if (this.translateService.currentLang) {
      this.refreshNames(this.translateService.currentLang);
    }

    this.translateService.onLangChange
      .subscribe(event => this.refreshNames(event.lang));
  }

  private refreshNames(language: string) {
    this.names.next(countries.getNames(language));
  }
}
