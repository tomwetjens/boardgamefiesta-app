import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {OAuthModule, OAuthStorage} from 'angular-oauth2-oidc';
import {TranslateModule} from '@ngx-translate/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {TableComponent} from './table/table.component';
import {HomeComponent} from './home/home.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SelectUserComponent} from './select-user/select-user.component';
import {FormsModule} from '@angular/forms';
import {ToastrComponent} from './toastr/toastr.component';
import {HttpInterceptorService} from './http-interceptor.service';
import {NavbarComponent} from './navbar/navbar.component';
import {LayoutComponent} from './layout/layout.component';
import {ProfileComponent} from './profile/profile.component';
import {GwtModule} from './gwt/gwt.module';
import {SharedModule} from './shared/shared.module';
import {UserMenuComponent} from './user-menu/user-menu.component';
import {AvatarComponent} from './avatar/avatar.component';
import { BoardFactoryComponent } from './board/board-factory.component';

@NgModule({
  declarations: [
    AppComponent,
    TableComponent,
    HomeComponent,
    SelectUserComponent,
    ToastrComponent,
    NavbarComponent,
    LayoutComponent,
    ProfileComponent,
    UserMenuComponent,
    AvatarComponent,
    BoardFactoryComponent
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
    NgbModule,
    SharedModule,
    GwtModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, multi: true, useClass: HttpInterceptorService},
    {provide: OAuthStorage, useFactory: () => localStorage}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
