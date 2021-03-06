import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({ name: 'relativeTime' })
export class RelativeTimePipe implements PipeTransform {
  transform(date: any) {
    if (date) {
      return moment(date).fromNow();
     }
  }
}