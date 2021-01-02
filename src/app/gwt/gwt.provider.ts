import {Injectable} from '@angular/core';
import {GameProvider, Option} from "../shared/api";
import {TranslateService} from "@ngx-translate/core";
import {LogEntry, Table, TablePlayer, User} from "../shared/model";
import {Buildings, Mode, PlayerOrder, Variant} from "./model";

@Injectable({
  providedIn: 'root'
})
export class GwtProvider implements GameProvider {

  getOptions(table: Table): Option[] {
    const options: Option[] = [
      {key: 'mode', values: [Mode.ORIGINAL, Mode.STRATEGIC], defaultValue: Mode.ORIGINAL},
      {key: 'buildings', values: [Buildings.BEGINNER, Buildings.RANDOMIZED], defaultValue: Buildings.RANDOMIZED},
      {key: 'playerOrder', values: [PlayerOrder.RANDOMIZED, PlayerOrder.BIDDING], defaultValue: PlayerOrder.RANDOMIZED},
      {key: 'variant', values: [Variant.ORIGINAL, Variant.BALANCED], defaultValue: Variant.ORIGINAL},
      {key: 'railsToTheNorth', values: [false, true], defaultValue: false}
    ];

    if (table.options['railsToTheNorth'] !== true) {
      Array.prototype.push.apply(options, [
        {key: 'stationMasterPromos', values: [false, true], defaultValue: false},
        {key: 'building11', values: [false, true], defaultValue: false}
      ]);
    }

    options.push({key: 'building13', values: [false, true], defaultValue: false});

    return options;
  }

  constructor(private translateService: TranslateService) {
  }

  translate(logEntry: LogEntry, table: Table): string {
    return logEntry.parameters[0] === 'ACTION'
      ? this.translateService.instant('gwt.log.action.' + logEntry.parameters[1], this.toInterpolateParams(logEntry.parameters.slice(2), table))
      : this.translateService.instant('gwt.log.' + logEntry.parameters[0], this.toInterpolateParams(logEntry.parameters.slice(1), table))
  }

  private toInterpolateParams(values: any[], table: Table) {
    return values.reduce((ctx, value, index) => {
      return {
        ...ctx,
        ['value' + (index + 1)]: this.translateValue(value, table)
      };
    }, {});
  }

  private translateValue(value: string, table: Table): string {
    const player = table.players[value];

    if (player) {
      return this.translatePlayer(player);
    }

    const key = table.game + '.log.values.' + value;
    const translated = this.translateService.instant(key);
    return translated !== key ? translated : value;
  }

  private translatePlayer(player: TablePlayer): string {
    return player.user
      ? this.translateUser(player.user)
      : this.translateService.instant('computer');
  }

  private translateUser(user: User) {
    return user.username;
  }

}
