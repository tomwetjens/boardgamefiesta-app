import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment';
import en from '../locale/en.json';
import nl from '../locale/nl.json';
import {Router} from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private translateService: TranslateService,
              private title: Title,
              private router: Router) {
  }

  ngOnInit(): void {
    this.translateService.setTranslation('en', en);
    this.translateService.setTranslation('nl', nl);

    this.userService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        console.log('setting user language:', currentUser.language);
        this.translateService.use(currentUser.language);
        moment.locale(currentUser.language);
      } else {
        console.log('setting default language:', this.translateService.getDefaultLang());
        this.translateService.use(this.translateService.getDefaultLang());
        moment.locale(this.translateService.getDefaultLang());
      }
    });

    this.router.events
      .subscribe(event => {
        // Initially set title, and restore title after navigating
        const appName = this.translateService.instant('appName');
        this.title.setTitle(appName);
      });
  }

}
