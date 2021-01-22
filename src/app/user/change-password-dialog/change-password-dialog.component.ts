import { Component, OnInit } from '@angular/core';
import {User} from "../../shared/model";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {UserService} from "../../user.service";
import {ToastrService} from "../../toastr.service";

@Component({
  selector: 'app-change-password-dialog',
  templateUrl: './change-password-dialog.component.html',
  styleUrls: ['./change-password-dialog.component.scss']
})
export class ChangePasswordDialogComponent implements OnInit {

  user: User;
  password: string;
  confirmPassword: string;

  constructor(public ngbActiveModal: NgbActiveModal,
              private userService: UserService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
  }

  submit() {
    this.userService.changePassword(this.user.id, this.password)
      .subscribe({
        complete: () => {
          this.toastrService.info('user.passwordChanged');
          this.ngbActiveModal.close();
        }
      });
  }
}
