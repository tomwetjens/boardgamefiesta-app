import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {GameComponent} from './game/game.component';
import {TrailComponent} from './trail/trail.component';
import {PlayerBoardComponent} from './player-board/player-board.component';
import {HomeComponent} from './home/home.component';
import {BoardComponent} from './board/board.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {OtherPlayerComponent} from './other-player/other-player.component';
import {AuthHttpInterceptor} from './auth-http-interceptor.service';
import { CreateGameComponent } from './create-game/create-game.component';
import { SelectUserComponent } from './select-user/select-user.component';
import {FormsModule} from '@angular/forms';
import { LobbyComponent } from './lobby/lobby.component';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TrailComponent,
    PlayerBoardComponent,
    HomeComponent,
    BoardComponent,
    OtherPlayerComponent,
    CreateGameComponent,
    SelectUserComponent,
    LobbyComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    OAuthModule.forRoot(),
    AppRoutingModule,
    NgbModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: AuthHttpInterceptor},
    {provide: OAuthStorage, useFactory: () => localStorage}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
