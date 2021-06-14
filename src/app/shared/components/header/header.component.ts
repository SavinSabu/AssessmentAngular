import { Component, OnInit, EventEmitter, Input, Output, Renderer2, ChangeDetectorRef } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { AppConfig } from '../../../app.config';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { LocationService } from 'app/shared/services/location.service';
import { Subscription } from 'rxjs';
import { LoginService } from 'app/shared/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { AppPromptService } from 'app/shared/services/app-prompt/app-prompt.service';
import { TopbarService } from 'app/shared/services/topbar.service';
import { Router } from '@angular/router';
import { companyAnimations } from 'app/shared/animations/company-animations';

@Component({
  selector: 'app-header',
  templateUrl: './header.template.html',
  animations: companyAnimations
})
export class HeaderComponent implements OnInit {
  currentLang = 'en';
  searchActive = false;
  advSearchActive = false;
  isBusiness = true;
  public availableLangs = [{
    name: 'English',
    code: 'en',
  }, {
    name: 'Spanish',
    code: 'es',
  }]
  public companyThemes;
  public layoutConf: any;
  public user: any;
  public companies: any = [];
  public username: string = "";
  public userphone: string = "";
  public usericon: string = "supervisor_account";
  public inAs: any = {};
  public CustomerFormPannelSubscription: Subscription;
  public FilterFormPanelSubscription: Subscription;
  public storeChangeSubscription: Subscription;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    public translate: TranslateService,
    private formDialog: MatDialog,
    private loginService: LoginService,
    private router: Router
  ) { }
  ngOnInit() {
    this.user = AppConfig.settings.currentUserDetails;
    this.companyThemes = this.themeService.companyThemes;
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang);
  }

  ngOnDestroy() {
    if (this.CustomerFormPannelSubscription) {
      this.CustomerFormPannelSubscription.unsubscribe();
    }
  }
  setLang(e) {
    this.translate.use(this.currentLang);
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      })
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      }, { transitionClass: true })
    }

    // * --> compact
    this.layout.publishLayoutChange({
      sidebarStyle: 'compact'
    }, { transitionClass: true })

  }
  logout() {
    this.loginService.logout();
  }
  changePassword() {
    const dialogRef = this.formDialog.open(ChangePasswordComponent, {
      width: "500px",
      maxHeight: "98%",
      maxWidth: "100%",
      data: {},
      disableClose: true
    });
  }
  searchNFilter(filter_value) {
    let filter = { "filter_field": "any", "filter_value": filter_value, "filter_display": "Any", "filter_display_value": filter_value };
    this.router.navigate([`/orders`]);
  }
  editProfile() {
    this.router.navigate([`/profile`]);
  }
  closeBusiness() {
    this.isBusiness = false;
  }
}