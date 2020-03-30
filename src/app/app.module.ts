import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {GameComponent} from './game/game.component';
import {TrailComponent} from './trail/trail.component';
import { PlayerBoardComponent } from './player-board/player-board.component';

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    TrailComponent,
    PlayerBoardComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
