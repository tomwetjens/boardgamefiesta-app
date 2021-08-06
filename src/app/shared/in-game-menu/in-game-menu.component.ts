/*
 * Board Game Fiesta
 * Copyright (C)  2021 Tom Wetjens <tomwetjens@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

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
