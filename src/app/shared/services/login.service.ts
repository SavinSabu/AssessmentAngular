import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loginData } from '../../shared/services/loginData';
import { BehaviorSubject, Observable } from 'rxjs';
import { AppConfig } from 'app/app.config';
import { LocationService } from './location.service';
import { Router } from '@angular/router';
import { CustomerSettings } from './customer.settings';
import { AppConfirmService } from './app-confirm/app-confirm.service';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public static capabilities;
  public static user;
  public static isSuper = false;
  static subFamily: BehaviorSubject<any> = new BehaviorSubject([]);
  constructor(
    private http: HttpClient,
    private route: Router,
    private customerSettings: CustomerSettings,
    public locationService: LocationService,
    private confirm: AppConfirmService
  ) {
  }
  login(signinData: loginData): Observable<any> {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/LoginCtrl/VerifyLogin", signinData);
  }
  logout() {
    this.confirm.confirm({
      title: 'Confirm',
      message: "Sign out from the session? Any unsaved data will be lost!"
    }).subscribe(confirm => {
      if (confirm) {
        this.locationService.stop();
        localStorage.removeItem("currentUserDetails");
        localStorage.removeItem("token");
        localStorage.removeItem("addresses");
        AppConfig.settings.currentUserDetails = null;
        this.customerSettings.loginLogoutTrigger.next();
        this.route.navigate(['/sessions/signin']);
      }
    });
  }
  sendVerificationSMS(user_id) {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/LoginCtrl/SendVerificationSMS", { user_id: user_id });
  }
  verifyOTP(otp_data) {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/LoginCtrl/verifyOTP", { 'otp_data': otp_data });
  }
  signup(data) {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/LoginCtrl/signup", { data: data });
  }
  public static getcapabilities(route: Router) {
    if (!LoginService.capabilities) {
      var token = localStorage.getItem('token');
      if (!token || token == 'undefined') {
        return false;
      }
      var families: any[] = JSON.parse(localStorage.getItem('families'));
      let cap = localStorage.getItem('capabilities');
      let family = parseInt(localStorage.getItem('family'));
      var capabilities = {};
      if (cap != 'undefined')
        capabilities = JSON.parse(cap);
      if (family > 0 && families.length) {
        let selectedFamily = families.filter(x => x.id == family);
        if (selectedFamily.length) {
          capabilities = selectedFamily[0].permissions;
        } else {
          localStorage.clear();
          AppConfig.settings.currentUserDetails = null;
          route.navigate(['/sessions/signin'], { replaceUrl: true });
        }
      }
      LoginService.setCapabilities({ token: token, capabilities: capabilities, families: families });
    }
    return LoginService.capabilities;
  }
  public static setCapabilities(data) {
    const JwtHelper = new JwtHelperService();
    LoginService.user = JwtHelper.decodeToken(data.token);
    if (data.capabilities) LoginService.user.capabilities = data.capabilities;
    if (data.families) {
      LoginService.user.families = data.families;
      LoginService.subFamily.next(data.families);
    }
    LoginService.capabilities = data.capabilities ? data.capabilities : LoginService.capabilities;
    if (LoginService.user.is_super === true || LoginService.user.is_super === 'Yes') {
      LoginService.isSuper = true;
    } else {
      LoginService.isSuper = false;
    }
  }
  getAllCompanies() {
    return this.http.post<any>(AppConfig.settings.apiServer.dataServer + "/company", {});
  }
}