/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
import {NgxChartsModule} from "@swimlane/ngx-charts";
import { ChangeUsernameDialogComponent } from './change-username-dialog/change-username-dialog.component';

const routes: Routes = [
  {
    path: ':username',
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
        NotSameValidator,
        ChangeUsernameDialogComponent
    ],
    exports: [
        UserComponent
    ],
    imports: [
        CommonModule,
        FormsModule,
        NgbModule,
        NgxChartsModule,
        TranslateModule.forChild(),
        RouterModule.forChild(routes),
        SharedModule,
    ]
})
export class UserModule {
}
