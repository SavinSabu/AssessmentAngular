import { Pipe, PipeTransform } from "@angular/core";
@Pipe({ name: 'datediff', pure: false })
export class DateDiffPipe implements PipeTransform {
    transform(date1: any, date2: any): any {
        if (date1 && date2) {
            let secs: number = (Date.parse(date2) - Date.parse(date1)) / 1000;
            let hours = Math.floor(secs / (60 * 60));
            let divisor_for_minutes = secs % (60 * 60);
            let minutes = Math.floor(divisor_for_minutes / 60);
            let divisor_for_seconds = divisor_for_minutes % 60;
            let seconds = Math.ceil(divisor_for_seconds);
            let hoursS = "";
            let minutesS = "";
            let secondsS = "";
            let ret = "";
            if (hours > 0) {
                hoursS = hours.toString();
                while (hoursS.length < 2) hoursS = "0" + hoursS;
                ret = hoursS + " hours ";
            }
            if (minutes > 0) {
                minutesS = minutes.toString();
                ret += minutesS + " minutes";
            }
            if (seconds > 0) {
                secondsS = seconds.toString();
                ret += secondsS + " seconds";
            }
            return ret;
        }
        return "00:00";
    }
}