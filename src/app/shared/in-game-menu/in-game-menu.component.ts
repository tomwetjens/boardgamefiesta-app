import {Component, Input, OnInit} from '@angular/core';
import {Table} from '../model';
import {TableService} from "../../table.service";
import {Router} from "@angular/router";
import {AudioService, ChannelType} from "../../audio.service";
import {MessageDialogComponent} from "../message-dialog/message-dialog.component";
import {fromPromise} from "rxjs/internal-compatibility";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ToastrService} from "../../toastr.service";

@Component({
  selector: 'app-in-game-menu',
  templateUrl: './in-game-menu.component.html',
  styleUrls: ['./in-game-menu.component.scss']
})
export class InGameMenuComponent implements OnInit {

  @Input() table: Table;

  constructor(private tableService: TableService,
              private audioService: AudioService,
              private toastrService: ToastrService,
              private router: Router,
              private ngbModal: NgbModal) {
  }

  ngOnInit(): void {
  }

  leave() {
    const ngbModalRef = this.ngbModal.open(MessageDialogComponent);
    const messageDialogComponent = ngbModalRef.componentInstance as MessageDialogComponent;
    messageDialogComponent.type = 'confirm';
    messageDialogComponent.messageKey = 'in-game-menu.confirmLeave';
    messageDialogComponent.confirmKey = 'leave';
    messageDialogComponent.cancelKey = 'cancel';
    fromPromise(ngbModalRef.result).subscribe(() => this.tableService.leave(this.table.id)
      .subscribe(() => this.router.navigateByUrl('/')));
  }

  toggleChannel(channelType: string) {
    const channel = this.audioService.channels[channelType as ChannelType];
    if (channel.muted) {
      channel.unmute();
      this.toastrService.info('notifications.audio.unmuted.' + channelType);
    } else {
      channel.mute();
      this.toastrService.info('notifications.audio.muted.' + channelType);
    }
  }

  isMuted(channelType: string) {
    return this.audioService.channels[channelType as ChannelType].muted;
  }
}
