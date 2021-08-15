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

import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ColorPreferences, EmailPreferences, User} from '../shared/model';
import {Observable} from 'rxjs';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChangeEmailDialogComponent} from "../user/change-email-dialog/change-email-dialog.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {ChangePasswordDialogComponent} from "../user/change-password-dialog/change-password-dialog.component";
import {ChangeUsernameDialogComponent} from "../user/change-username-dialog/change-username-dialog.component";
import {TitleService} from "../title.service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: Observable<User>;

  constructor(private userService: UserService,
              private titleService: TitleService,
              private translateService: TranslateService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.user = this.userService.currentUser;
    this.titleService.setTitle(this.translateService.instant('profile.title'));
  }

  changeLocation(user: User, location: string) {
    this.userService.changeLocation(user.id, location).subscribe();
  }

  changeTimeZone(user: User, timeZone: string) {
    this.userService.changeTimeZone(user.id, timeZone).subscribe();
  }

  changeLanguage(user: User, language: string) {
    this.userService.changeLanguage(user.id, language)
      .subscribe(() => {
        window.location.reload();
      });
  }

  changeEmail(user: User) {
    const ngbModalRef = this.ngbModal.open(ChangeEmailDialogComponent);
    const componentInstance = ngbModalRef.componentInstance as ChangeEmailDialogComponent;
    componentInstance.user = user;
    fromPromise(ngbModalRef.result).subscribe();
  }

  changePassword(user: User) {
    const ngbModalRef = this.ngbModal.open(ChangePasswordDialogComponent);
    const componentInstance = ngbModalRef.componentInstance as ChangePasswordDialogComponent;
    componentInstance.user = user;
    fromPromise(ngbModalRef.result).subscribe();
  }

  changeUsername(user: User) {
    const ngbModalRef = this.ngbModal.open(ChangeUsernameDialogComponent);
    const componentInstance = ngbModalRef.componentInstance as ChangeUsernameDialogComponent;
    componentInstance.user = user;
    fromPromise(ngbModalRef.result).subscribe();
  }

  changeEmailPreferences(emailPreferences: EmailPreferences) {
    this.userService.changeEmailPreferences(emailPreferences).subscribe();
  }

  changeColorPreferences(colorPreferences: ColorPreferences) {
    this.userService.changeColorPreferences(colorPreferences).subscribe();
  }
}
