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
