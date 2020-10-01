import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {TranslateModule} from "@ngx-translate/core";
import {RouterModule, Routes} from "@angular/router";
import {RatingComponent} from "./rating/rating.component";
import {SharedModule} from "../shared/shared.module";
import { RatingDetailsComponent } from './rating-details/rating-details.component';

const routes: Routes = [
  {
    path: ':userId',
    children: [
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
    RatingDetailsComponent
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
