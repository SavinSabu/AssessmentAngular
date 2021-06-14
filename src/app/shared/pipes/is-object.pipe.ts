import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'isobject', pure: false })
export class IsObjectPipe implements PipeTransform {
  transform(value: string, check: boolean|string) {
    const forbidden = (typeof value == 'string')||(value == null);
    return forbidden && !!check ? false : true;
  }
}