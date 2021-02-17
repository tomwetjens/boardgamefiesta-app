import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import momentTz from 'moment-timezone';
import en from '../locale/en.json';
import it from '../locale/it.json';
import nl from '../locale/nl.json';
import pt from '../locale/pt.json';
import '@angular/common/locales/global/en';
import '@angular/common/locales/global/it';
import '@angular/common/locales/global/nl';
import '@angular/common/locales/global/pt';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private translateService: TranslateService) {
  }

  ngOnInit(): void {
    this.translateService.setTranslation('en', en);
    this.translateService.setTranslation('it', it);
    this.translateService.setTranslation('nl', nl);
    this.translateService.setTranslation('pt', pt);

    this.userService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.translateService.use(currentUser.language);
        moment.locale(currentUser.language);
        moment.tz.setDefault(currentUser.timeZone);
      } else {
        this.translateService.use(this.translateService.getDefaultLang());
        moment.locale(this.translateService.getDefaultLang());
        moment.tz.setDefault();
      }
    });
  }

}
