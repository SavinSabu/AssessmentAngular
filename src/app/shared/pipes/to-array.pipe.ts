import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'toArray', pure: false })
export class ToArrayPipe implements PipeTransform {
  transform(value: string) {
    return value.split(",");
  }
}