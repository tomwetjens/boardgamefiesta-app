import {Injectable} from '@angular/core';
import {Title} from "@angular/platform-browser";
import {Router} from "@angular/router";
import {TranslateService} from "@ngx-translate/core";

@Injectable({
  providedIn: 'root'
})
export class TitleService {

  private appName: string;

  constructor(private title: Title,
              private router: Router,
              private translateService: TranslateService) {
    this.appName = this.translateService.instant('appName');

    this.router.events
      .subscribe(event => {
        // Initially set title, and restore title after navigating
        this.title.setTitle(this.appName);
      });
  }

  setTitle(text: string) {
    this.title.setTitle(text + ' - ' + this.appName);
  }

}
