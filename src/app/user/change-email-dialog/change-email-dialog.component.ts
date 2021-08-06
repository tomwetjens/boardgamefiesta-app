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
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../user.service";
import {User} from "../../shared/model";
import {ToastrService} from "../../toastr.service";

@Component({
  selector: 'app-change-email-dialog',
  templateUrl: './change-email-dialog.component.html',
  styleUrls: ['./change-email-dialog.component.scss']
})
export class ChangeEmailDialogComponent implements OnInit {

  user: User;
  email: string;
  code: string;

  constructor(public ngbActiveModal: NgbActiveModal,
              private userService: UserService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
  }

  submit() {
    this.userService.changeEmail(this.user.id, this.email)
      .subscribe(() => {
        this.toastrService.info('user.emailChanged');
        this.ngbActiveModal.close();
      });
  }

}
