import {Injectable} from '@angular/core';
import {GameProvider, Option} from "../shared/api";
import {TranslateService} from "@ngx-translate/core";
import {LogEntry, Table} from "../shared/model";
import {LayoutType} from "./model";

@Injectable({
  providedIn: 'root'
})
export class BigBazarProvider implements GameProvider {

  getOptions(): Option[] {
    return [
      {
        key: 'layoutType',
        values: [LayoutType.SHORT_PATHS, LayoutType.LONG_PATHS, LayoutType.IN_ORDER, LayoutType.RANDOM],
        defaultValue: LayoutType.RANDOM
      }
    ];
  }

  constructor(private translateService: TranslateService) {
  }

  translate(logEntry: LogEntry, table: Table): string {
    return this.translateService.instant('big-bazar.log.' + logEntry.parameters[0],
      logEntry.parameters.reduce((interpolateObject, value, index) => {
        const type = logEntry.parameters[0];

        interpolateObject['value' + index] =
          (['MOVE', 'MOVE_SMUGGLER', 'MOVE_GOVERNOR', 'SEND_FAMILY_MEMBER'].includes(type) && index == 1)
          || (type === 'MOVE_DUMMY' && index === 2) ? this.translateService.instant('big-bazar.places.' + value)
            : this.translateValue(value);
        return interpolateObject;
      }, {}));
  }

  private translateValue(value: string) {
    const key = 'big-bazar.log.value.' + value;
    const result = this.translateService.instant(key);
    return result !== key ? result : value;
  }
}
