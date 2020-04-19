import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';
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
import {CreateGameComponent} from './create-game/create-game.component';
import {SelectUserComponent} from './select-user/select-user.component';
import {FormsModule} from '@angular/forms';
import {ToastrComponent} from './toastr/toastr.component';
import {CardComponent} from './card/card.component';
import {FromNowPipe} from './from-now.pipe';
import {HandSelectComponent} from './hand-select/hand-select.component';
import {DeliveryCityComponent} from './delivery-city/delivery-city.component';
import {HttpInterceptorService} from './http-interceptor.service';
import {ConnectionStatusComponent} from './connection-status/connection-status.component';
import {NavbarComponent} from './navbar/navbar.component';
import {GameListComponent} from './game-list/game-list.component';
import {LayoutComponent} from './layout/layout.component';
import { CardStackComponent } from './card-stack/card-stack.component';
import { CattleMarketComponent } from './cattle-market/cattle-market.component';
import { PlayerBuildingsComponent } from './player-buildings/player-buildings.component';
import { ObjectiveCardsComponent } from './objective-cards/objective-cards.component';
import { EndedDialogComponent } from './ended-dialog/ended-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TrailComponent,
    PlayerBoardComponent,
    HomeComponent,
    BoardComponent,
    CreateGameComponent,
    SelectUserComponent,
    ToastrComponent,
    CardComponent,
    FromNowPipe,
    HandSelectComponent,
    DeliveryCityComponent,
    ConnectionStatusComponent,
    NavbarComponent,
    GameListComponent,
    LayoutComponent,
    CardStackComponent,
    CattleMarketComponent,
    PlayerBuildingsComponent,
    ObjectiveCardsComponent,
    EndedDialogComponent
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
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: HttpInterceptorService},
    {provide: OAuthStorage, useFactory: () => localStorage}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
