import { Injectable, SimpleChange } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';
import * as moment from 'moment'
declare var device: any;
declare var AutostartPermission: any;
declare var plugins: any;
@Injectable({
  providedIn: 'root'
})
export class CommonService {

  errorSnackSetting: MatSnackBarConfig = { horizontalPosition: "center", verticalPosition: "top", duration: 30000, panelClass: "error-snackbar" };
  public lastChecked:moment.Moment = moment("2019-01-01");
  constructor() { }
  public defaultValues: any = {
    "start_time": "08:30:00",
    "end_time": "20:30:00"
  };
  public simDetails: any[] = [];
  copyText() {
    var a = window.getSelection().toString();
    var b = a.replace(/\s*\n\s*[\n\s]+/gi, "\n\n").replace(/\n/gi, "\n");
    return b;
  }

  public requestAutostartPermission() {
    const phones = [
      "xiaomi",
      "oppo",
      "vivo",
      "letv",
      "honor",
      "oneplus",
      "asus",
      "samsung"
    ];
    try {
      if (AutostartPermission && device.platform == "Android") {
        phones.map(
          phone => {
            phone == device.manufacturer.toLowerCase() ? AutostartPermission.openAutostartPermissionPopup() : () => { };
          });
      }
    } catch (e) {
    }
  }

  public getSimDetails(callback) {
    if(this.simDetails.length > 0 && moment.duration(moment(new Date()).diff(this.lastChecked)).asMinutes() < 10){
      callback(true, this.simDetails);
      return;
    }
    if (typeof plugins !== "undefined" && plugins.sim && plugins.sim.hasReadPermission) {
      plugins.sim.hasReadPermission(hasPermission => {
        if (hasPermission) {
          plugins.sim.getSimInfo(info => {
            this.simDetails = info.cards ? info.cards : [];
            this.lastChecked = moment(new Date());
            callback(true, this.simDetails);
          });
        } else {
          plugins.sim.requestReadPermission(permission => {
            plugins.sim.getSimInfo(info => {
              this.simDetails = info.cards ? info.cards : [];
              this.lastChecked = moment(new Date());
              callback(true, this.simDetails)
            });
          })
        }
      })
    }else{
      callback(false, "Plugin not availabe")
    }
  }
}
