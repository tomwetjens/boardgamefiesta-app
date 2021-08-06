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

import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Observable} from "rxjs";
import {FriendService} from "../../friend.service";
import {User} from "../../shared/model";
import {switchMap} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SelectUserComponent} from "../../select-user/select-user.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'user-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnChanges {

  @Input() userId: string;
  @Input() readOnly: boolean;

  friends$: Observable<User[]>;

  constructor(private friendService: FriendService,
              private authService: AuthService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  private refresh() {
    this.friends$ = this.friendService.get(this.userId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userId) {
      this.refresh();
    }
  }

  add() {
    const ngbModalRef = this.ngbModal.open(SelectUserComponent);

    fromPromise(ngbModalRef.result)
      .pipe(switchMap(user => this.friendService.add(user.id)))
      .subscribe(() => this.refresh());
  }

  remove(friend: User) {
    this.friendService.remove(friend.id)
      .subscribe(() => this.refresh());
  }
}
