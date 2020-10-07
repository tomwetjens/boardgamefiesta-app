import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {FriendService} from "../../friend.service";
import {User} from "../../shared/model";
import {switchMap, takeUntil} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SelectUserComponent} from "../../select-user/select-user.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'user-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnDestroy {

  @Input() userId: string;

  private destroyed = new Subject();

  friends$: Observable<User[]>;

  constructor(private friendService: FriendService,
              private authService: AuthService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.friends$ = this.authService.userId.pipe(
      switchMap(currentUserId => currentUserId === this.userId
        ? this.friendService.myFriends$
        : this.friendService.friends$(this.userId)),
      takeUntil(this.destroyed));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  add() {
    const ngbModalRef = this.ngbModal.open(SelectUserComponent);

    fromPromise(ngbModalRef.result)
      .pipe(switchMap(user => this.friendService.add(user.id)))
      .subscribe();
  }

  remove(friend: User) {
    this.friendService.remove(friend.id)
      .subscribe();
  }
}
