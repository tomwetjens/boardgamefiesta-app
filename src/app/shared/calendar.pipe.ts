import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'cal'
})
export class CalendarPipe implements PipeTransform {

  transform(value: Date | number | string): string {
    return moment(value).calendar(null, {
      // Only to override locale:
      // sameDay: 'LT',
      // lastDay: '[Yesterday at] LT',
      // lastWeek: '[last] dddd [at] LT',
      sameElse: 'LLLL' // Locale default does not include time
    });
  }

}
