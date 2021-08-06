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
import {User} from "../../shared/model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../user.service";
import {ToastrService} from "../../toastr.service";

@Component({
  selector: 'app-change-username-dialog',
  templateUrl: './change-username-dialog.component.html',
  styleUrls: ['./change-username-dialog.component.scss']
})
export class ChangeUsernameDialogComponent implements OnInit {

  user: User;
  username: string;

  constructor(public ngbActiveModal: NgbActiveModal,
              private userService: UserService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.username = this.user.username;
  }

  submit() {
    this.userService.changeUsername(this.username)
      .subscribe(() => {
        this.toastrService.info('user.usernameChanged');
        this.ngbActiveModal.close();
      });
  }

}
