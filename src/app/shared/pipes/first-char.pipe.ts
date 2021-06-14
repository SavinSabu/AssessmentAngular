import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'firstChar', pure: false })
export class FirstCharPipe implements PipeTransform {
  transform(value: string) {
    return value.substr(0, 1).toUpperCase();
  }
}