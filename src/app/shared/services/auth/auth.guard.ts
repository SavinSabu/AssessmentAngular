import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AppConfig } from 'app/app.config';
import { JwtHelperService } from "@auth0/angular-jwt";
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable()
export class AuthGuard implements CanActivate {
  public authToken;
  private isAuthenticated = false; // Set this value dynamically
  public nextUrl = '/orders'

  constructor(
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.checkAuth();
  }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.snackBar) {
      this.snackBar.dismiss();
    }
    this.checkAuth();
    if(route.component && route.component["name"] == "AdminLayoutComponent") {
      return true;
    }
    if (this.isAuthenticated) {
      return true
    }
    this.nextUrl = state.url;
    this.router.navigate(['auth/signin']);
    return false;
  }

  checkAuth() {
    const JwtHelper = new JwtHelperService();
    var token = localStorage.getItem('token');
    if (!token) {
      this.isAuthenticated = false;
      return false;
    }
    var tokenData = JwtHelper.decodeToken(token);
    this.isAuthenticated = true;
    let currentUser = JSON.parse(localStorage.getItem('currentUserDetails'));
    AppConfig.settings.currentUserDetails = currentUser;
    return true;
  }
}