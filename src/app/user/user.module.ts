import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule, Routes} from "@angular/router";
import {RatingComponent} from "./rating/rating.component";
import {SharedModule} from "../shared/shared.module";
import {RatingDetailsComponent} from './rating-details/rating-details.component';
import {ActivityComponent} from './activity/activity.component';
import {UserComponent} from './user/user.component';
import { FriendsComponent } from './friends/friends.component';
import { FriendComponent } from './friend/friend.component';
import { ChangeEmailDialogComponent } from './change-email-dialog/change-email-dialog.component';
import {FormsModule} from "@angular/forms";
import { ChangePasswordDialogComponent } from './change-password-dialog/change-password-dialog.component';
import { SameValidator } from './change-password-dialog/same-validator.directive';
import {NotSameValidator} from "./change-email-dialog/not-same-validator.directive";

const routes: Routes = [
  {
    path: ':userId',
    children: [
      {
        path: '',
        component: UserComponent
      },
      {
        path: 'rating',
        component: RatingComponent
      }
    ]
  }
];

@NgModule({
  declarations: [
    RatingComponent,
    RatingDetailsComponent,
    ActivityComponent,
    UserComponent,
    FriendsComponent,
    FriendComponent,
    ChangeEmailDialogComponent,
    ChangePasswordDialogComponent,
    SameValidator,
    NotSameValidator
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class UserModule {
}
