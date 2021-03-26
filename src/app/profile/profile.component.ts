import {Component, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {User} from '../shared/model';
import {Observable} from 'rxjs';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChangeEmailDialogComponent} from "../user/change-email-dialog/change-email-dialog.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {ChangePasswordDialogComponent} from "../user/change-password-dialog/change-password-dialog.component";
import {ChangeUsernameDialogComponent} from "../user/change-username-dialog/change-username-dialog.component";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  user: Observable<User>;

  constructor(private userService: UserService,
              private ngbModal: NgbModal) {
    this.user = this.userService.currentUser;
  }

  ngOnInit(): void {
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
}
