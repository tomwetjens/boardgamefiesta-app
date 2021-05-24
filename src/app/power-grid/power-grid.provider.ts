import {Injectable} from '@angular/core';
import {GameProvider, Option} from "../shared/api";
import {TranslateService} from "@ngx-translate/core";
import {LogEntry, Table} from "../shared/model";

@Injectable({
  providedIn: 'root'
})
export class PowerGridProvider implements GameProvider {

  getOptions(): Option[] {
    return [];
  }

  constructor(private translateService: TranslateService) {
  }

  translate(logEntry: LogEntry, table: Table): string {
    return this.translateService.instant('power-grid.log.' + logEntry.parameters[0]);
  }

}
