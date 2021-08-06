/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
