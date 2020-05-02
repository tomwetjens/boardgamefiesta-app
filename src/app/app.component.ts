import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';
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
              private translateService: TranslateService,
              private title: Title) {
  }

  ngOnInit(): void {
    console.log('loading translations for en:', en);
    this.translateService.setTranslation('en', en);
    console.log('loading translations for nl:', nl);
    this.translateService.setTranslation('nl', nl);

    this.userService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.title.setTitle('Great Western Trail: ' + currentUser.username);
        console.log('setting user language:', currentUser.language);
        this.translateService.use(currentUser.language);
      } else {
        this.title.setTitle('Great Western Trail');
        console.log('setting default language:', this.translateService.getDefaultLang());
        this.translateService.use(this.translateService.getDefaultLang());
      }
    });
  }

}
