import {Component, Input, OnInit} from '@angular/core';
import {LogEntry, Table, TablePlayer, User} from "../../shared/model";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'gwt-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  @Input() table: Table;

  constructor(private translateService: TranslateService) {
  }

  ngOnInit(): void {
  }

  private translateValue(value: string): string {
    const player = this.table.players[value];

    if (player) {
      return this.translatePlayer(player);
    }

    const gameSpecificKey = this.table.game + '.log.values.' + value;
    const genericKey = 'log.values.' + value;

    let translated = this.translateService.instant(gameSpecificKey);
    if (translated === gameSpecificKey) {
      translated = this.translateService.instant(genericKey);
    }

    return translated !== genericKey ? translated : value;
  }

  private translatePlayer(player: TablePlayer): string {
    return player.user
      ? this.translateUser(player.user)
      : this.translateService.instant('computer');
  }

  private translateUser(user: User) {
    return user.username;
  }

  interpolateParams(logEntry: LogEntry) {
    return logEntry.parameters
      .slice(logEntry.parameters[0] === 'ACTION' ? 2 : 0)
      .reduce((ctx, value, index) => {
        return {
          ...ctx,
          ['value' + (index + 1)]: this.translateValue(value)
        };
      }, {})
  }

}
