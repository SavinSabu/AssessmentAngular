import { Component, OnInit, AfterViewInit, ViewChild, HostListener } from '@angular/core';
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

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.template.html'
})
export class AdminLayoutComponent implements OnInit, AfterViewInit {
  public isModuleLoading: Boolean = false;
  private moduleLoaderSub: Subscription;
  private layoutConfSub: Subscription;
  private routerEventSub: Subscription;
  private mediaSub: Subscription;
  public scrollConfig = {}
  public layoutConf: any = {};

  constructor(
    private router: Router,
    public translate: TranslateService,
    private layout: LayoutService
  ) {
    // Close sidenav after route change in mobile
    this.routerEventSub = router.events.pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((routeChange: NavigationEnd) => {
        this.layout.adjustLayout({ route: routeChange.url });
      });

    // Translator init
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
  }
  ngOnInit() {
    this.layoutConf = this.layout.layoutConf;
    // this.layout.adjustLayout();

    // FOR MODULE LOADER FLAG
    this.moduleLoaderSub = this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.isModuleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.isModuleLoading = false;
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.layout.adjustLayout(event);
  }

  ngAfterViewInit() {
    this.layoutConfSub = this.layout.layoutConf$.subscribe(change => {
      this.initBodyPS(change)
    })
  }

  initBodyPS(layoutConf: any = {}) {
     this.scrollToTop('.rightside-content-hold');
  }
  scrollToTop(selector: string) {
    if (document) {
      let element = <HTMLElement>document.querySelector(selector);
      element.scrollTop = 0;
    }
  }
  ngOnDestroy() {
    if (this.moduleLoaderSub) {
      this.moduleLoaderSub.unsubscribe()
    }
    if (this.layoutConfSub) {
      this.layoutConfSub.unsubscribe()
    }
    if (this.routerEventSub) {
      this.routerEventSub.unsubscribe()
    }
  }
  closeSidebar() {
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    })
  }

}