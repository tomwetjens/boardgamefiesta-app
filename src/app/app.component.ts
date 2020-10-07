import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import en from '../locale/en.json';
import nl from '../locale/nl.json';

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
    this.translateService.setTranslation('nl', nl);

    this.userService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.translateService.use(currentUser.language);
        moment.locale(currentUser.language);
      } else {
        this.translateService.use(this.translateService.getDefaultLang());
        moment.locale(this.translateService.getDefaultLang());
      }
    });
  }

}
