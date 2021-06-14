import { Component, OnInit, AfterViewInit, HostListener, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { 
  Router, 
  NavigationEnd, 
  RouteConfigLoadStart, 
  RouteConfigLoadEnd, 
  ResolveStart, 
  ResolveEnd 
} from '@angular/router';
import { Subscription } from "rxjs";
import { TranslateService } from '@ngx-translate/core';
import { LayoutService } from '../../../services/layout.service';
import { filter } from 'rxjs/operators';
import { CustomerSettings } from 'app/shared/services/customer.settings';
import { AppConfig } from 'app/app.config';
import { LoginService } from 'app/shared/services/login.service';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.template.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CustomerLayoutComponent implements OnInit {
  public isModuleLoading: Boolean = false;
  private moduleLoaderSub: Subscription;
  private routerEventSub: Subscription;
  private searchTriggerSubscription: Subscription;
  private cartTotalTriggerSubscription: Subscription;
  private loginLogoutTriggerSubscription: Subscription;
  public scrollConfig = {}
  public layoutConf: any = {};
  fabricSearch: boolean = false;
  public cartTotal: number = 0;
  public user;
  constructor(
    private router: Router,
    public translate: TranslateService,
    private layout: LayoutService,
    private loginService: LoginService,
    private customerSettings: CustomerSettings,
    private cd: ChangeDetectorRef
  ) {
    this.routerEventSub = router.events.pipe(filter(event => event instanceof NavigationEnd))
    .subscribe((routeChange: NavigationEnd) => {
      this.layout.adjustLayout({ route: routeChange.url });
      this.cd.detectChanges();
    });
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit() {
    this.user = AppConfig.settings.currentUserDetails;
    var cart = localStorage.getItem("cart");
    if (cart) {
      cart = JSON.parse(cart);
    }
    this.cartTotalTriggerSubscription = this.customerSettings.cartTotalTrigger.subscribe(next => {
      this.cartTotal = next.count;
      this.cd.detectChanges();
    });
    this.loginLogoutTriggerSubscription = this.customerSettings.loginLogoutTrigger.subscribe(next => {
      this.user = AppConfig.settings.currentUserDetails;
      this.cd.detectChanges();
    });
    this.layoutConf = this.layout.layoutConf;
    this.moduleLoaderSub = this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.isModuleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
      this.cd.detectChanges();
    });
    this.cd.detectChanges();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.layout.adjustLayout(event);
    this.cd.detectChanges();
  }

  ngOnDestroy() {
    if (this.moduleLoaderSub) {
      this.moduleLoaderSub.unsubscribe()
    }
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe()
    }
    if (this.searchTriggerSubscription) {
      this.searchTriggerSubscription.unsubscribe();
    }
    if (this.cartTotalTriggerSubscription) {
      this.cartTotalTriggerSubscription.unsubscribe();
    }
    if (this.loginLogoutTriggerSubscription) {
      this.loginLogoutTriggerSubscription.unsubscribe();
    }
  }

  gotoPage(page) {
    if(page == 'signout') {
      this.loginService.logout();
    } else {
      if(page == 'home/my-orders' && !this.user) {
        localStorage.setItem("redirect", "my-orders");
        page = 'sessions/signin';
      }
      this.router.navigate(['/' + page]);
    }
  }

  search(search_value) {
  }

}