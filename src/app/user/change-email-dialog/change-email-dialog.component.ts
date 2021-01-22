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
