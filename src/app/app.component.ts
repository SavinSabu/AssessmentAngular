import { Component, OnInit, AfterViewInit, Renderer2, NgZone, HostListener, ChangeDetectionStrategy, NgModuleRef } from '@angular/core';
import { DomSanitizer, Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { RoutePartsService } from './shared/services/route-parts.service';
import { ThemeService } from './shared/services/theme.service';

import { filter } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from './shared/services/common.service';
import { TopbarService } from './shared/services/topbar.service';
import { MatIconRegistry } from '@angular/material/icon';
import { AppUpdateService } from './shared/services/app-updater.service';
import { BootController } from './boot-control';
import { AppModule } from './app.module';
declare var navigator: any;
declare var Connection: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = 'Portfolio - Savin Sabu';
  pageTitle = 'Dashboard';
  lastKeys: any[] = [];
  constructor(
    public title: Title,
    public router: Router,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private appUpdate: AppUpdateService,
    private themeService: ThemeService,
    private renderer: Renderer2,
    private translateService: TranslateService,
    private topbarService: TopbarService,
    private common: CommonService,
    private matIconRegistry: MatIconRegistry,
    private ngZone: NgZone,
    private domSanitizer: DomSanitizer,
    private m: NgModuleRef<AppModule>
  ) {
    this.matIconRegistry.addSvgIcon(
      'customIcon',
      this.domSanitizer.bypassSecurityTrustResourceUrl('../assets/icons/favicon.ico'));
  }

  ngOnInit() {
    let scope = this;
    document.addEventListener('offline', () => {
      this.router.navigate(['/offline'], { skipLocationChange: true });
    }, false);
    document.addEventListener('online', () => {
      if (this.router.routerState.snapshot.url.toString() === '/offline') {
        this.router.navigate(['/customers'], { skipLocationChange: true });
      }
    }, false);
    if (navigator && navigator.connection && navigator.connection.type && Connection && navigator.connection.type == Connection.NONE) {
      this.router.navigate(['/offline'], { skipLocationChange: true });
    }
    this.common.getSimDetails(function (status, data) {
    });
    this.changePageTitle();
  }

  ngAfterViewInit() {
    this.themeService.applyMatTheme(this.renderer)
  }

  changePageTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((routeChange) => {
      let routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length) {
        return this.title.setTitle(this.appTitle);
      }
      // Extract title from parts;
      this.pageTitle = routeParts
        .reverse()
        .map((part) => { part.title = this.parseText(part); return part.title })
        .reduce((partA, partI) => { return `${partA} > ${partI}` });
      this.pageTitle += ` : ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);
    });
  }
  parseText(part) {
    part.title = part.title.replace(/{{([^{}]*)}}/g, function (a, b) {
      let r = part.params[b];
      return typeof r === 'string' ? r : a;
    });
    let title = this.translateService.instant(part.title);
    return title.charAt(0).toUpperCase() + title.slice(1)
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    if (/\d/.test(event.key)) {
      this.lastKeys.push({ key: event.key, time: new Date().getTime() });
      if (this.lastKeys.length > 10) {
        this.lastKeys.shift();
      }
    } else {
      if (this.lastKeys.length > 9 && event.code === 'Enter' && this.lastKeys[9].time - this.lastKeys[0].time < 200) {
        let k = this.lastKeys;
        this.topbarService.rfTrigger.next(k.reduce((x, y) => { return `${x}${y['key']}` }, ''));
      }
      this.lastKeys = [];
    }
  }
  @HostListener('window:afterprint', [])
  onWindowAfterPrint() {
    this.ngZone.runOutsideAngular(() => {
      BootController.getbootControl().restart();
      this.m.destroy();
    });
  }
  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    this.ngZone.runOutsideAngular(() => {
      BootController.getbootControl().restart();
      this.m.destroy();
    });
  }
}
