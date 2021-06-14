import { Pipe, PipeTransform } from "@angular/core";
import { LoginService } from "../services/login.service";
import { Router } from "@angular/router";

@Pipe({ name: 'permitted', pure: false })
export class HasPermissionPipe implements PipeTransform {
  constructor(public route: Router){}
  transform(value: string) {
    if (value.indexOf('.') > 0) {
      let caps = LoginService.getcapabilities(this.route);
      if (LoginService.isSuper) {
        return true;
      }
      if (!caps) {
        return false;
      }
      let dt = value.split(".");
      if (dt.length > 2 || !(dt[0] in caps)) {
        return false;
      } else if (caps[dt[0]].indexOf(dt[1]) > -1) {
        return true;
      }
    }
    return false;
  }
}