import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {map, switchMap, takeUntil} from "rxjs/operators";
import {Observable, Subject} from "rxjs";
import {User} from "../../shared/model";
import {UserService} from "../../user.service";
import {TitleService} from "../../title.service";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnDestroy {

  private destroyed = new Subject();

  username$: Observable<string>;
  user$: Observable<User>;
  currentUser$: Observable<User>;

  constructor(
    private route: ActivatedRoute,
    private titleService: TitleService,
    private userService: UserService) {
  }

  ngOnInit(): void {
    this.username$ = this.route.params.pipe(map(({username}) => username));

    this.currentUser$ = this.userService.currentUser;

    this.user$ = this.username$.pipe(
      switchMap(username => this.userService.get(username)),
      takeUntil(this.destroyed));

    this.user$.subscribe(user => this.titleService.setTitle(user.username));
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

}
