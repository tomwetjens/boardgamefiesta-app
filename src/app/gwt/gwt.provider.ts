import {Injectable} from '@angular/core';
import {GameProvider, Options} from "../shared/api";
import {TranslateService} from "@ngx-translate/core";
import {LogEntry, Table, TablePlayer, User} from "../shared/model";
import {Buildings, Mode, PlayerOrder, Variant} from "./model";

@Injectable({
  providedIn: 'root'
})
export class GwtProvider implements GameProvider {

  options: Options = {
    mode: {values: [Mode.ORIGINAL, Mode.STRATEGIC], defaultValue: Mode.ORIGINAL},
    buildings: {values: [Buildings.BEGINNER, Buildings.RANDOMIZED], defaultValue: Buildings.RANDOMIZED},
    playerOrder: {values: [PlayerOrder.RANDOMIZED, PlayerOrder.BIDDING], defaultValue: PlayerOrder.RANDOMIZED},
    variant: {values: [Variant.ORIGINAL, Variant.BALANCED], defaultValue: Variant.ORIGINAL}
  };

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
