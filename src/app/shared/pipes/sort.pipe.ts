import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'sort', pure: false })
export class SortPipe implements PipeTransform {
  transform(array: any[], fieldName: string, order: string="asc") {
    if(!array){
      return;
    }
    array.sort((a,b) => {
      if(isNaN(a[fieldName])) {
        return order == "asc" ? a[fieldName].toString().localeCompare(b[fieldName].toString()): b[fieldName].toString().localeCompare(a[fieldName].toString());
      } else {
        return order == "asc" ? a[fieldName]-b[fieldName]: b[fieldName]-a[fieldName];
      }
    })
    return array;
  }
}