import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'distance', pure: false })
export class DistancePipe implements PipeTransform {
    transform(value: number) {
        if (value > 1) {
            return value.toFixed(2) + ' km';
        } else {
            return (value * 1000).toFixed(0) + ' m';
        }
    }
}