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
