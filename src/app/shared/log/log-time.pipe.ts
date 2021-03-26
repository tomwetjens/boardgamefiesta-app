import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'logTime'
})
export class LogTimePipe implements PipeTransform {

  transform(value: Date | number): string {
    const str = moment(value).calendar(null, {
      // Only to override locale:
      // sameDay: 'LT',
      // lastDay: '[Yesterday at] LT',
      // lastWeek: '[last] dddd [at] LT',
      sameElse: 'LLLL' // Locale default does not include time
    });
    return str.charAt(0).toUpperCase() + str.substr(1);
  }

}
