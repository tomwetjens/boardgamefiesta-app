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
    FriendComponent
  ],
  imports: [
    CommonModule,
    NgbModule,
    TranslateModule.forChild(),
    RouterModule.forChild(routes),
    SharedModule,
  ]
})
export class UserModule {
}
