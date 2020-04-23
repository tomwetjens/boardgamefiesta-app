import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {UserService} from './user.service';
import {TranslateService} from '@ngx-translate/core';

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
    this.userService.currentUser.subscribe(currentUser => {
      if (currentUser) {
        this.title.setTitle('Great Western Trail: ' + currentUser.username);
        this.translateService.use(currentUser.language);
      } else {
        this.title.setTitle('Great Western Trail');
        this.translateService.use(this.translateService.getDefaultLang());
      }
    });
  }

}
