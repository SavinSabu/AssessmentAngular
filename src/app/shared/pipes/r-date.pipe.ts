import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
  name: 'rdate',
})
export class RDatePipe implements PipeTransform {
  transform(date: any, format?: string): any {
      format = format ? format : 'DD/MM/yyyy';
      if (date) {
        var formated = moment(date).format(format);
       return formated == 'Invalid date' ? '' : formated;
      }
    }
}