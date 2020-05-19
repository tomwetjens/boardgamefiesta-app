import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import {TranslateModule} from '@ngx-translate/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TableComponent} from './table/table.component';
import {TrailComponent} from './trail/trail.component';
import {PlayerBoardComponent} from './player-board/player-board.component';
import {HomeComponent} from './home/home.component';
import {BoardComponent} from './board/board.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
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
import {LayoutComponent} from './layout/layout.component';
import {CardStackComponent} from './card-stack/card-stack.component';
import {CattleMarketComponent} from './cattle-market/cattle-market.component';
import {PlayerBuildingsComponent} from './player-buildings/player-buildings.component';
import {ObjectiveCardsComponent} from './objective-cards/objective-cards.component';
import {EndedDialogComponent} from './ended-dialog/ended-dialog.component';
import {ObjectivesDialogComponent} from './objectives-dialog/objectives-dialog.component';
import {HazardComponent} from './hazard/hazard.component';
import {TeepeeComponent} from './teepee/teepee.component';
import {StationMasterComponent} from './station-master/station-master.component';
import {MessageDialogComponent} from './message-dialog/message-dialog.component';
import {LogComponent} from './log/log.component';
import {TestComponent} from './test/test.component';
import { ProfileComponent } from './profile/profile.component';
import { PlayerNameComponent } from './player-name/player-name.component';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    TrailComponent,
    PlayerBoardComponent,
    HomeComponent,
    BoardComponent,
    SelectUserComponent,
    ToastrComponent,
    CardComponent,
    FromNowPipe,
    HandSelectComponent,
    DeliveryCityComponent,
    ConnectionStatusComponent,
    NavbarComponent,
    LayoutComponent,
    CardStackComponent,
    CattleMarketComponent,
    PlayerBuildingsComponent,
    ObjectiveCardsComponent,
    EndedDialogComponent,
    ObjectivesDialogComponent,
    HazardComponent,
    TeepeeComponent,
    StationMasterComponent,
    MessageDialogComponent,
    LogComponent,
    TestComponent,
    ProfileComponent,
    PlayerNameComponent,
    TimerComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    OAuthModule.forRoot(),
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      useDefaultLang: true
    }),
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
