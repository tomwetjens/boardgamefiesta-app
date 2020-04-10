import {HttpClient} from '@angular/common/http';
import {Component, OnInit} from '@angular/core';
import {OAuthService} from 'angular-oauth2-oidc';
import {environment} from '../environments/environment';
import {Title} from '@angular/platform-browser';
import {UserService} from './user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private httpClient: HttpClient,
              private userService: UserService,
              private title: Title) {
  }

  ngOnInit(): void {
    this.userService.currentUser.subscribe(currentUser => {
      this.title.setTitle('GWT: ' + currentUser.username);
    });
  }

}
