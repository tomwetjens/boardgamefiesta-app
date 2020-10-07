import {Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges} from '@angular/core';
import {Observable, Subject} from "rxjs";
import {FriendService} from "../../friend.service";
import {User} from "../../shared/model";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {SelectUserComponent} from "../../select-user/select-user.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {AuthService} from "../../auth.service";

@Component({
  selector: 'user-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.scss']
})
export class FriendsComponent implements OnInit, OnChanges, OnDestroy {

  @Input() userId: string;

  private destroyed = new Subject();

  friends$: Observable<User[]>;
  isSelf$: Observable<boolean>;

  constructor(private friendService: FriendService,
              private authService: AuthService,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  private refresh() {
    this.isSelf$ = this.authService.userId.pipe(
      map(currentUserId => currentUserId === this.userId));

    this.friends$ = this.isSelf$.pipe(
      switchMap(isSelf => isSelf
        ? this.friendService.myFriends$
        : this.friendService.friends$(this.userId)),
      takeUntil(this.destroyed));
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.userId) {
      this.refresh();
    }
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
