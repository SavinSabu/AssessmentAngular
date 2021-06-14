import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: 'sectotime', pure: false })
export class SecondsToTimePipe implements PipeTransform {
    transform(secs: number) {
        var hours = Math.floor(secs / (60 * 60));
        var divisor_for_minutes = secs % (60 * 60);
        var minutes = Math.floor(divisor_for_minutes / 60).toString();
        while (minutes.length < 2) minutes = "0" + minutes;
        var divisor_for_seconds = divisor_for_minutes % 60;
        var seconds = Math.ceil(divisor_for_seconds).toString();
        while (seconds.length < 2) seconds = "0" + seconds;
        return  hours + ":" + minutes + ":" + seconds;
    }
}