import {Component, NgZone, OnDestroy, OnInit} from '@angular/core';
import {ToastrMessage, ToastrService} from '../toastr.service';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {fadeInOnEnterAnimation} from "angular-animations";

@Component({
  selector: 'app-toastr',
  animations: [
    fadeInOnEnterAnimation({duration: 500})
  ],
  templateUrl: './toastr.component.html',
  styleUrls: ['./toastr.component.scss']
})
export class ToastrComponent implements OnInit, OnDestroy {

  toastrMessages: ToastrMessage[] = [];

  private destroyed = new Subject();

  constructor(private toastrService: ToastrService, private ngZone: NgZone) {
  }

  ngOnInit(): void {
    this.toastrService.messages
      .pipe(
        takeUntil(this.destroyed)
        //  TODO debounce or distinct?
      )
      .subscribe(toastrMessage => {
        this.ngZone.run(() => this.toastrMessages.push(toastrMessage));
      });
  }

  ngOnDestroy(): void {
    this.destroyed.next(true);
  }

  hide(msg: ToastrMessage) {
    const index = this.toastrMessages.indexOf(msg);
    this.toastrMessages.splice(index, 1);
  }
}
